import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgpu'; 

async function setupWebGPU() {
  if (navigator.gpu) {
    try {
      await tf.setBackend('webgpu');
      await tf.ready();
      console.log('Successfully using WebGPU!');
    } catch (e) {
      console.error('Failed to start WebGPU, falling back to WebGL', e);
      await tf.setBackend('webgl');
    }
  } else {
    console.log('WebGPU not supported on this browser. Using WebGL.');
    await tf.setBackend('webgl');
  }
  
  console.log(`Current Backend: ${tf.getBackend()}`);
}

setupWebGPU();
function logBackendDuringInference(stage: string) {
  const backend = tf.getBackend();
  const backendInstance = tf.engine().backendInstance?.constructor?.name;

  console.log(`🔍 [${stage}] TFJS Backend:`, backend);
  console.log(`🔍 [${stage}] Backend Class:`, backendInstance);

  if (backend !== 'webgpu') {
    console.warn(`⚠️ NOT running on WebGPU during ${stage}!`);
  }
}

export async function loadFaceAttributeModels() {
  const [ageModel, genderModel, emotionModel, ethnicityModel] = await Promise.all([
    tf.loadGraphModel("/models/age_model_js/model.json"),
    tf.loadGraphModel("/models/gender_model_js/model.json"),
    tf.loadGraphModel("/models/emotion_model_js/model.json"),
    tf.loadGraphModel("/models/ethnicity_model_js/model.json"),
  ]);

  return {
    age: ageModel,
    gender: genderModel,
    emotion: emotionModel,
    ethnicity: ethnicityModel,
  };
}

function getFaceTensor (video : any, prediction : any){

    const imageDimension = 200;

    const [x1, y1] = prediction.topLeft;
    const [x2, y2] = prediction.bottomRight;

    const faceWidth = x2 - x1;
    const faceHeight = y2 - y1;

    const faceTensor = tf.tidy(() => {
        const frame = tf.browser.fromPixels(video);

        const faceImage = frame
            .slice(
                [Math.floor(y1), Math.floor(x1), 0],
                [Math.floor(faceHeight), Math.floor(faceWidth), 3]
            )
            .resizeNearestNeighbor([imageDimension, imageDimension])
            .toFloat()
            .div(255.0);

        return faceImage.transpose([2, 0, 1]).expandDims(0);
    });
    return faceTensor;
}

function find_value_by_logit(logit : any, my_feature : any){
    const gender_mapping : any = {0: 'Female', 1: 'Male'}
    const ethnicity_mapping : any = {0: 'Asian', 1: 'Black', 2: 'Indian', 3: 'Others', 4: 'White'}
    const emotion_mapping : any= {0: 'Anger', 1: 'Contempt', 2: 'Disgust', 3: 'Fear', 4: 'Happy', 5: 'Neutral', 6: 'Sad', 7: 'Surprise'}

    if (my_feature == "gender") {
        let gender_id = (1 / (1 + Math.exp(-logit[0])) > 0.5) ? 1 : 0;
        return gender_mapping[gender_id]; 
    }

    else if (my_feature == "ethnicity") {
        const ethnicity_id = Object.values(logit).indexOf(Math.max(...Object.values(logit)));  
        return ethnicity_mapping[ethnicity_id]; 
    }

    else if (my_feature == "emotion"){
        const emotion_id = Object.values(logit).indexOf(Math.max(...Object.values(logit)));  
        return emotion_mapping[emotion_id]; 
    }
    
    else{
        return Math.round(logit[0]);
    }
}

async function analyzeFace(model : any, video: HTMLVideoElement, prediction: any) {
    const faceTensor = getFaceTensor(video, prediction);
    logBackendDuringInference("before age prediction");

    const agePrediction = await model.age.executeAsync(faceTensor); 
    const age_logit = agePrediction.dataSync();

    const genderPrediction = await model.gender.executeAsync(faceTensor); 
    const gender_logit = genderPrediction.dataSync();

    const emotionPrediction = await model.emotion.executeAsync(faceTensor); 
    const emotion_logit = emotionPrediction.dataSync();

    const ethnicityPrediction = await model.ethnicity.executeAsync(faceTensor); 
    const ethnicity_logit = ethnicityPrediction.dataSync();

    return {
        "age" : find_value_by_logit(age_logit, "age"),
        "gender" : find_value_by_logit(gender_logit, "gender"),
        "emotion" : find_value_by_logit(emotion_logit, "emotion"),
        "ethnicity" : find_value_by_logit(ethnicity_logit, "ethnicity")
    }
    
}

export async function analyzeFaces(model: any, video: any, predictions: any) {
    const results = [];

    for (const prediction of predictions) {
        const result = await analyzeFace(model, video, prediction);
        results.push(result);
    }

    return results;
}
