import streamlit as st

from dashboard import dashboard
from product_list import product_list
from order_management import order_management

def main():
    st.sidebar.title("Admin Panel")
    app_mode = st.sidebar.selectbox("Choose the App Mode", ["Dashboard", "Product List", "Order Management"])

    if app_mode == "Dashboard":
        dashboard()
    elif app_mode == "Product List":
        product_list()
    elif app_mode == "Order Management":
        order_management()

if __name__ == "__main__":
    main()
