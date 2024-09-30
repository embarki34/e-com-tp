import streamlit as st
import axios
import requests
import pandas as pd
import asyncio 


API_BASE_URL = "http://localhost:3001/api"  # Adjust this to your Next.js API URL

def fetch_products():
    try:
        response = requests.get(f"{API_BASE_URL}/products")
        response.raise_for_status()
        products = response.json()
        return pd.DataFrame(products)
    except requests.RequestException as e:
        st.error(f"Failed to fetch products: {str(e)}")
        return pd.DataFrame()

def create_product(name, description, price, stock_quantity, image1, image2, image3):
    try:
        files = {}
        data = {
            "product_name": name,
            "description": description,
            "price": price,
            "stock_quantity": stock_quantity
        }
        if image1:
            files['image1'] = ('image1.jpg', image1, 'image/jpeg')
        if image2:
            files['image2'] = ('image2.jpg', image2, 'image/jpeg')
        if image3:
            files['image3'] = ('image3.jpg', image3, 'image/jpeg')
        
        response = requests.post(f"{API_BASE_URL}/products", data=data, files=files)
        response.raise_for_status()
        st.success(f"Product '{name}' created successfully!")
    except requests.RequestException as e:
        st.error(f"Failed to create product: {str(e)}")

async def update_product(product_id, name=None, description=None, price=None, stock_quantity=None, image1=None, image2=None, image3=None):
    form_data = axios.FormData()

    # Add only the edited fields
    if name:
        form_data.append('product_name', name)
    if description:
        form_data.append('description', description)
    if price is not None:
        form_data.append('price', price)
    if stock_quantity is not None:
        form_data.append('stock_quantity', stock_quantity)
    
    if image1:
        form_data.append('image1', image1)
    if image2:
        form_data.append('image2', image2)
    if image3:
        form_data.append('image3', image3)

    try:
        # Sending the PUT request
        response = await axios.put(f"{API_BASE_URL}/products/{product_id}", data=form_data)
        print(f"Product '{product_id}' updated successfully!")
        print("Response:", response.data)
    except axios.exceptions.AxiosError as e:
        print(f"Failed to update product: {e.response.data if e.response else str(e)}")



def delete_product(product_id):
    try:
        response = requests.delete(f"{API_BASE_URL}/products/{product_id}")
        response.raise_for_status()
        st.success(f"Product ID {product_id} deleted successfully!")
    except requests.RequestException as e:
        st.error(f"Failed to delete product: {str(e)}")

def product_list():
    st.title("Product Management")
    
    # Create Product
    st.header("Create New Product")
    with st.form(key='create_product_form'):
        name = st.text_input("Product Name")
        description = st.text_area("Description")
        price = st.number_input("Price", min_value=0.0, format="%.2f")
        stock_quantity = st.number_input("Stock Quantity", min_value=0)
        image1 = st.file_uploader("Image 1", type=['jpg', 'jpeg', 'png'])
        image2 = st.file_uploader("Image 2", type=['jpg', 'jpeg', 'png'])
        image3 = st.file_uploader("Image 3", type=['jpg', 'jpeg', 'png'])
        submit_button = st.form_submit_button("Create Product")
        if submit_button:
            create_product(name, description, price, stock_quantity, image1, image2, image3)

    # Display Products
    st.header("Existing Products")
    products = fetch_products()
    if not products.empty:
        st.dataframe(products)
    else:
        st.info("No products found.")

    # Edit Product
    st.header("Edit Product")
    edit_product_id = st.number_input("Product ID to Edit", min_value=1)
    if st.button("Load Product for Editing"):
        product = products[products["product_id"] == edit_product_id]
        if not product.empty:
            product = product.iloc[0]
            with st.form(key='edit_product_form'):
                new_name = st.text_input("New Product Name", product["product_name"])
                new_description = st.text_area("New Description", product["description"])
                new_price = st.number_input("New Price", value=float(product["price"]), min_value=0.0, format="%.2f")
                new_stock = st.number_input("New Stock Quantity", value=int(product["stock_quantity"]), min_value=0)
                new_image1 = st.file_uploader("New Image 1", type=['jpg', 'jpeg', 'png'], key="new_image1")
                new_image2 = st.file_uploader("New Image 2", type=['jpg', 'jpeg', 'png'], key="new_image2")
                new_image3 = st.file_uploader("New Image 3", type=['jpg', 'jpeg', 'png'], key="new_image3")
                update_button = st.form_submit_button("Update Product")
                if update_button:
                    update_product(edit_product_id, new_name, new_description, new_price, new_stock, new_image1, new_image2, new_image3)
        else:
            st.error("Product ID not found.")

    # Delete Product
    st.header("Delete Product")
    delete_product_id = st.number_input("Product ID to Delete", min_value=1)
    if st.button("Delete Product"):
        delete_product(delete_product_id)

if __name__ == "__main__":
    asyncio.run(update_product(12, "testing123", "New description", 123123123, 50, None, None, None))
    product_list()
