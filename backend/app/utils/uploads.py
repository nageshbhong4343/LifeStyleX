import os
import uuid
from fastapi import UploadFile, HTTPException
from app.core.config import settings

def save_upload_file(upload_file: UploadFile) -> str:
    if not os.path.exists(settings.UPLOAD_DIR):
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    extension = os.path.splitext(upload_file.filename)[1]
    if not extension:
        extension = ".jpg"
        
    filename = f"{uuid.uuid4().hex}{extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    try:
        with open(file_path, "wb") as buffer:
            buffer.write(upload_file.file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

    return f"/uploads/{filename}"
