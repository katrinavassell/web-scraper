import streamlit as st
import os
import base64
import zipfile
from io import BytesIO

def create_extension_zip():
    """Create a ZIP file containing all Chrome extension files"""
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

    return memory_zip.getvalue()

def main():
    st.title("Chrome Extension Download")

    st.markdown("""
    Download the Chrome extension for easier feedback collection.
    """, unsafe_allow_html=True)
    
    st.markdown("""
    ### Installation Instructions:
    1. Click the download button below to get the extension files
    2. Extract the downloaded ZIP file
    3. Open Chrome Extensions: `chrome://extensions/` <a href="chrome://extensions/" target="_blank"><button style='background-color: white; border: none; color: #6C63FF; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;'>Open Link</button></a>
    4. Enable "Developer mode" in the top right
    5. Click "Load unpacked" and select the extracted folder
""", unsafe_allow_html=True)

    zip_data = create_extension_zip()
    st.download_button(
        label="Download Extension Files",
        data=zip_data,
        file_name="feedback-collector-extension.zip",
        mime="application/zip"
    )

    st.markdown("""
    ### Features:
    - Collect feedback posts directly from websites
    - Avoid duplicate posts by checking for duplicates based on post title and details
    - Track changes in post votes or description 
    - Filter and search through collected posts
    - Export data to CSV format
    - Clean, modern UI with "Collect All" functionality
    
    """, unsafe_allow_html=True)



if __name__ == "__main__":
    main()