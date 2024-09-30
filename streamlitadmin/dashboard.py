import streamlit as st
import requests
import pandas as pd
import altair as alt

# Function to fetch data from API
def fetch_data(endpoint):
    response = requests.get(endpoint)
    if response.status_code == 200:
        return response.json()
    else:
        st.error("Failed to fetch data from the API.")
        return None

# Function to generate a carousel-like structure
def display_carousel(data):
    selected_item = st.selectbox("Select a Business Insight", data.keys())
    st.markdown(f"<h3 style='text-align: center;'>{selected_item}</h3>", unsafe_allow_html=True)
    st.markdown(f"<h2 style='text-align: center; color: #5e5e5e;'>{data[selected_item]}</h2>", unsafe_allow_html=True)

def dashboard():
    st.title("Admin Dashboard")

    # Fetch products and orders data
    products_data = fetch_data("http://localhost:3001/api/products")
    orders_data = fetch_data("http://localhost:3001/api/orders")

    if products_data is not None and orders_data is not None:
        total_products = len(products_data)
        total_orders = len(orders_data)

        # Convert orders data to DataFrame for analysis
        df_orders = pd.DataFrame(orders_data)

        # Ensure total_price is numeric
        if 'total_price' in df_orders.columns and 'order_date' in df_orders.columns:
            # Convert 'total_price' to numeric (handle any invalid parsing with errors='coerce')
            df_orders['total_price'] = pd.to_numeric(df_orders['total_price'], errors='coerce')

            # Convert 'order_date' to datetime for analysis
            df_orders['order_date'] = pd.to_datetime(df_orders['order_date'])

            # Drop rows where total_price is NaN (from any failed conversions)
            df_orders = df_orders.dropna(subset=['total_price'])

            # Calculate total revenue for all orders
            total_revenue = df_orders['total_price'].sum()

            # Group revenue by order date
            revenue_by_date = df_orders.groupby('order_date')['total_price'].sum().reset_index()

            # Additional business metrics
            avg_order_value = total_revenue / total_orders if total_orders > 0 else 0
            total_customers = df_orders['customer_id'].nunique()

            # Define business insights for the carousel
            business_insights = {
                "Total Revenue": f"${total_revenue:,.2f}",
                "Average Order Value": f"${avg_order_value:,.2f}",
                "Total Products": total_products,
                "Total Orders": total_orders,
                "Total Customers": total_customers,
            }

            # Display Business Insights Carousel
            display_carousel(business_insights)

            # Plot Total Revenue Over Time using Altair
            st.subheader("Total Revenue Over Time")

            revenue_chart = alt.Chart(revenue_by_date).mark_line(point=True).encode(
                x='order_date:T',
                y='total_price:Q',
                tooltip=['order_date:T', 'total_price:Q']
            ).properties(
                title='Revenue Over Time'
            )

            st.altair_chart(revenue_chart, use_container_width=True)

        else:
            st.warning("Total price or order date information is missing in the orders data.")

if __name__ == "__main__":
    dashboard()
