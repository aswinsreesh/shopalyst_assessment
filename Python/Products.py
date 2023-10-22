import requests #Imports the requests library, which allows to send HTTP requests and handle the responses easily.

def get_product_details(): #defines a function
    api_endpoint = "https://dev.shopalyst.com/shopalyst-service/v1/products/929323BCA2A04A74961E0043E9A55B60"
    response = requests.get(api_endpoint) #Sends a GET request to the specified API endpoint and stores the response in the variable response.
    
    if response.status_code == 200: #If the request is success
        product_data = response.json() #Process the JSON data received from the API.
        
#It loops through each SKU in the product data and prints details such as SKU ID, shade, offer price
# and a combination of the product title and shade.
#The enumerate() function is used to iterate through the SKU set and provides an index for each SKU, starting from 1.

        for idx, sku in enumerate(product_data['skuSet'], start=1): 
            sku_id = sku['skuId']
            shade = sku['attributes']['1']  # Assuming '1' is the attribute ID for shade
            offer_price = sku['offerPrice']
            title = product_data['title'] + " - " + shade
            
            print(f"--------------------------")
            print(f"Product {idx}")
            print(f"skuId : {sku_id}")
            print(f"shade : {shade}")
            print(f"offerPrice : {offer_price}")
            print(f"title : {title}")
        
        print(f"--------------------------")
        
    else:
        print(f"Failed to retrieve data for Product. Status code: {response.status_code}") #If data not present

get_product_details()
