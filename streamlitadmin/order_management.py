import streamlit as st
import requests
import pandas as pd

API_BASE_URL = "http://localhost:3001/api/orders"  # Update with your Next.js API base URL

def fetch_orders():
    response = requests.get(API_BASE_URL)
    if response.status_code == 200:
        return response.json()
    else:
        st.error("Error fetching orders: " + response.json().get('message', 'Unknown error'))
        return []

def update_order_status(order_id, new_status):
    response = requests.put(f"{API_BASE_URL}/{order_id}", json={"status": new_status})
    if response.status_code == 200:
        st.success(f"Order ID {order_id} status updated to '{new_status}'!")
    else:
        st.error("Error updating order status: " + response.json().get('message', 'Unknown error'))

def delete_order(order_id):
    response = requests.delete(f"{API_BASE_URL}/{order_id}")
    if response.status_code == 200:
        st.success(f"Order ID {order_id} deleted successfully!")
    else:
        st.error("Error deleting order: " + response.json().get('message', 'Unknown error'))

def order_management():
    st.title("Order Management")

    # Fetch and display existing orders
    orders = fetch_orders()
    if orders:
        st.subheader("Existing Orders")
        orders_df = pd.DataFrame(orders)
        st.dataframe(orders_df)

        # Update Order Status
        order_id = st.number_input("Order ID to Update", min_value=1)
        new_status = st.selectbox(
            "New Status", [
                'Pending',
                'Calling for Confirmation',
                'Confirmed',
                'Packing',
                'Out for Delivery',
                'Delivered (Waiting for DC to Call You)'
            ]
        )
        if st.button("Update Status"):
            update_order_status(order_id, new_status)

        # Delete Order
        delete_order_id = st.number_input("Order ID to Delete", min_value=1)
        if st.button("Delete Order"):
            delete_order(delete_order_id)

if __name__ == "__main__":
    order_management()
