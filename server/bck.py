# Copyright 2019 Google LLC All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from flask import Flask, request
from flask_cors import CORS

from google.cloud import datacatalog_v1

import json
import re

app = Flask(__name__,static_url_path='')
CORS(app)
from google.oauth2 import service_account

@app.route('/', methods=['GET'])
def fetch_dc():   
    #return f"Retrieved entry {entry.name} for BigQuery Dataset resource {entry.linked_resource}"
    return app.send_static_file('index.html')

@app.route('/fetch-tags', methods=['POST'])
def fetch_tags():
    client = datacatalog_v1.DataCatalogClient()
    data = request.json
    linked_resource = data['linked_resource']
    entry = client.lookup_entry(request={"linked_resource": linked_resource})
    entry_tags=client.list_tags(parent=entry.name)
    response=[]
    for results in entry_tags: 
        result_map={ "tag name": results.template_display_name}
    
    
    response.append(result_map)

    return json.dumps(response)


@app.route('/search', methods=['GET'])
def search():
    args=request.args
    search_string_arg=args.get("search-string")

    client = datacatalog_v1.DataCatalogClient()
    #SCOPES = ['https://www.googleapis.com/auth/cloud-platform']
    #SERVICE_ACCOUNT_FILE = './service.json'
    #credentials = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    #delegated_credentials = credentials.with_subject('data-marketplace-demo@mdm-dg.iam.gserviceaccount.com')
    
    #search_string = "name:*"
    search_string = f"{search_string_arg} and tag:data_product_ownership"
    scope = datacatalog_v1.types.SearchCatalogRequest.Scope()
    #scope.include_project_ids.append(project_id)
    scope.include_org_ids.append("989067243343")
    #resource_name = f"//bigquery.googleapis.com/projects/customers-343423/datasets/customer_data"
    #entry = client.lookup_entry(request={"linked_resource": resource_name})
    #request = datacatalog_v1.SearchCatalogRequest(scope="includeProjectIds",query="query_value")
    
    search_results = client.search_catalog(scope=scope, query=search_string)

    #page_result = client.search_catalog(request=request)

    response=[]

    print("Results in project:")
    for result in search_results:
        print(result.linked_resource)
        
        m = re.match(r"^(?P<uri>.+?)/projects/(?P<project>.+?)/(?P<type>.+?)/(?P<name>.+?)$",
            result.linked_resource,
        )  

        result_map={ 
            "name": m['name'].rsplit('/',1)[-1],
            "project":m['project'],
            "type":m['type'],
            "search_result_type":result.search_result_type.name, 
            "integrated_system":result.integrated_system.name,
            "fully_qualified_name": result.fully_qualified_name,
            "modify_time":result.modify_time.nanosecond,
            "linked_resource":result.linked_resource
            }
        response.append(result_map)

    return json.dumps(response)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
    #search()

