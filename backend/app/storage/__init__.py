from app.config import IS_LOCAL

if IS_LOCAL:
    from app.storage.local.upload import (
        upload_image_local as upload_image,
        upload_video_local as upload_video,
    )
else:
    from app.storage.cloud.upload import (
        upload_image_to_cloud as upload_image,
        upload_video_to_cloud as upload_video,
    )
