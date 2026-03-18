export const drawMesh = (ctx : any, scaleX : number, scaleY  : number, predictions : any) => {
  if (!predictions || predictions.length === 0) return;

  predictions.forEach((prediction : any) => {
    const start = prediction.topLeft;
    const end = prediction.bottomRight;
    
    const x = start[0] * scaleX;
    const y = start[1] * scaleY;
    const width = (end[0] - start[0]) * scaleX;
    const height = (end[1] - start[1]) * scaleY;

    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "#00ffa2"; 
    ctx.rect(x, y, width, height);
    ctx.stroke();
  });
};

export function getStreamFaces (faceCtx : any, faceCanvas : any, video : any, videoWidth : any, videoHeight : any, predictions : any) {
    var streamFaces = [];
    
    for (const pred of predictions) {

        const [x, y] = pred.topLeft;
        const [x2, y2] = pred.bottomRight;

        const width = x2 - x;
        const height = y2 - y;

        faceCanvas.width = width;
        faceCanvas.height = height;

        faceCtx.drawImage(
            video,
            x, y, width, height, 
            0, 0, width, height 
        );

        const faceImage = faceCanvas.toDataURL("image/png");
        streamFaces.push( {
            "url": faceImage,           
            "age_v1": "23",
            "age_v2": "20-24",
            "gender": "Male",
            "emotion": "Happy",
            "ethnicity": "Indian" 
        });
    }

    return streamFaces;
}