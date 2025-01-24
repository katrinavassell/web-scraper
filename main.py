import streamlit as st
import os
import zipfile
from io import BytesIO

def create_zip_file():
    extension_files = [
        'manifest.json',
        'content.js',
        'background.js',
        'styles.css',
        'popup/popup.html',
        'popup/popup.css',
        'popup/popup.js',
        'icons/icon16.png',
        'icons/icon48.png',
        'icons/icon128.png',
        'icons/icon.svg'
    ]

    memory_zip = BytesIO()
    with zipfile.ZipFile(memory_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
        for file_path in extension_files:
            if os.path.exists(file_path):
                zf.write(file_path)
            else:
                st.error(f"Missing file: {file_path}")

    return memory_zip.getvalue()

def main():
    st.title("Chrome Extension Download")
    st.markdown("""
   This allows you to scrape any public Canny feature request board. Try with Canny's on https://feedback.canny.io/feature-requests.

    ### Instructions:
    1. Click the download button below to get the extension files.
    2. Extract the downloaded zip file.
    3. Open Chrome and go to `chrome://extensions/`.
    4. Enable "Developer mode" in the top right.
    5. Click "Load unpacked" and select the extracted folder.
    """)

    zip_data = create_zip_file()
    st.download_button(
        label="Download Extension Files",
        data=zip_data,
        file_name="feedback-collector-extension.zip",
        mime="application/zip"
    )

if __name__ == "__main__":
    main()
