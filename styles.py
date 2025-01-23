import streamlit as st

def apply_styles():
    """
    Applies custom CSS styles to the Streamlit app.
    """
    st.markdown("""
        <style>
        /* Main container */
        .main {
            padding: 2rem;
        }
        
        /* Headers */
        h1 {
            color: #2C3E50;
            font-weight: 700;
            margin-bottom: 2rem;
        }
        
        h2 {
            color: #34495E;
            font-weight: 600;
            margin: 1.5rem 0;
        }
        
        /* Data frame styling */
        .dataframe {
            font-family: 'Inter', sans-serif;
            border-collapse: collapse;
            margin: 1rem 0;
        }
        
        .dataframe th {
            background-color: #F7F9FC;
            padding: 0.75rem;
            border-bottom: 2px solid #E2E8F0;
        }
        
        .dataframe td {
            padding: 0.75rem;
            border-bottom: 1px solid #E2E8F0;
        }
        
        /* Buttons */
        .stButton>button {
            background-color: #6C63FF;
            color: white;
            border-radius: 4px;
            padding: 0.5rem 1rem;
            border: none;
            transition: all 0.3s ease;
        }
        
        .stButton>button:hover {
            background-color: #5B52E0;
        }
        
        /* Input fields */
        .stTextInput>div>div>input {
            border-radius: 4px;
            border: 1px solid #E2E8F0;
        }
        
        /* Spinner */
        .stSpinner>div>div {
            border-top-color: #6C63FF !important;
        }
        
        /* Success/Error messages */
        .stSuccess {
            background-color: #D1FAE5;
            border-left-color: #059669;
        }
        
        .stError {
            background-color: #FEE2E2;
            border-left-color: #DC2626;
        }
        </style>
    """, unsafe_allow_html=True)
