import os
# pyrefly: ignore [missing-import]
import streamlit as st
import pandas as pd
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Configure the Streamlit page
st.set_page_config(
    page_title="Catalyst 2026",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom styling for a polished look
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }
    .sub-header {
        color: #6b7280;
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background-color: #f8fafc;
        border-radius: 8px;
        padding: 1rem;
        border: 1px solid #e2e8f0;
    }
</style>
""", unsafe_allow_html=True)

# ----------------- SIDEBAR -----------------
with st.sidebar:
    st.image("https://img.icons8.com/isometric/100/lightning-bolt.png", width=64)
    st.title("⚡ Catalyst 2026")
    st.caption("CISSA Hackathon Team Workspace")
    st.divider()
    
    mode = st.radio(
        "Navigation",
        ["🏠 Overview", "🤖 AI Core Engine", "📊 Live Insights", "⚙️ Settings"],
        index=0
    )
    
    st.divider()
    api_key_set = bool(os.getenv("GEMINI_API_KEY"))
    if api_key_set:
        st.success("✅ Gemini API Key Detected")
    else:
        st.warning("⚠️ No API Key found in .env (Demo Mode)")

# ----------------- MAIN CONTENT -----------------

if mode == "🏠 Overview":
    st.markdown('<div class="main-header">⚡ Catalyst 2026 Prototype</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Ready for prompt launch & fast feature development.</div>', unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric(label="Team Readiness", value="100%", delta="Ready")
    with col2:
        st.metric(label="Stack", value="Python + Streamlit", delta="Pure Python")
    with col3:
        st.metric(label="AI Integration", value="Gemini API", delta="Enabled")
        
    st.divider()
    
    st.subheader("🎯 Project Mission")
    st.info("💡 Awaiting prompt release. Once the CISSA theme is announced, we will plug in our core workflow right here!")

elif mode == "🤖 AI Core Engine":
    st.subheader("🤖 AI Core Engine")
    st.write("Test out prompts, data processing, and smart agent actions.")
    
    user_prompt = st.text_area("Input Text / Problem Scenario:", placeholder="Enter your data or question here...", height=120)
    
    col1, col2 = st.columns([1, 4])
    with col1:
        run_btn = st.button("🚀 Process with AI", use_container_width=True, type="primary")
        
    if run_btn:
        if not user_prompt.strip():
            st.warning("Please enter some text first.")
        else:
            with st.spinner("Analyzing with AI..."):
                # Placeholder response until real API key & logic connected
                st.success("✅ Analysis Complete!")
                st.markdown("### 📋 Results Summary")
                st.write(f"**Processed Input:** {user_prompt}")
                st.info("*(Connect your logic in `app.py` or create a new backend module)*")

elif mode == "📊 Live Insights":
    st.subheader("📊 Data & Insights Dashboard")
    st.write("Demonstrate live data manipulation, charts, and metrics.")
    
    # Sample mock dataset for demo
    sample_data = pd.DataFrame({
        "Category": ["Phase 1", "Phase 2", "Phase 3", "Phase 4"],
        "Completion (%)": [100, 85, 60, 20],
        "Impact Score": [95, 88, 92, 79]
    })
    
    col1, col2 = st.columns([2, 3])
    with col1:
        st.dataframe(sample_data, use_container_width=True)
    with col2:
        st.bar_chart(sample_data.set_index("Category"))

elif mode == "⚙️ Settings":
    st.subheader("⚙️ App Configuration")
    st.write("Manage environment settings and mock data toggles.")
    demo_mode = st.toggle("Enable Mock Demo Responses", value=True)
    st.write(f"Mock Demo Status: **{'Active' if demo_mode else 'Live API'}**")
