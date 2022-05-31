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

from flask import Flask, request, render_template
from flask_cors import CORS

from google.cloud import datacatalog_v1
from google.protobuf.json_format import MessageToJson, MessageToDict

import json
import re

app = Flask(__name__,template_folder="../client/build", static_folder="../client/build/static")
CORS(app)
from google.oauth2 import service_account

#@app.route('/', methods=['GET'])
#def fetch_dc():   
   # return app.send_static_file('index.html')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    """ This is a catch all that is required for react-router """
    return render_template('index.html')

@app.route('/fetch-tags', methods=['POST'])
def fetch_tags():
    client = datacatalog_v1.DataCatalogClient()
    data = request.json
    linked_resource = data['linked_resource']
    entry = client.lookup_entry(request={"linked_resource": linked_resource})
    entry_tags=client.list_tags(parent=entry.name)
    response=[]
    #json_obj = MessageToDict(entry_tags)
    
    #data = getattr(config, config.WhichOneof('config')).value

    for entry_tag in entry_tags: 
        result_fields =[]
        result_map={}
        #print(entry_tag)
        for field_key, field_val in entry_tag.fields.items():
            #print(getattr(entry_tag.fields.WhichOneOf('kind')).value)
            double_value = None if field_val.double_value == 0.0 else field_val.double_value
            string_value = None if field_val.string_value == '' else field_val.string_value
            timestamp_value = None if field_val.timestamp_value == '' else field_val.timestamp_value
            enum_val = None if field_val.enum_value.display_name == '' else field_val.enum_value.display_name
            richtext_value = None if field_val.richtext_value == '' else field_val.richtext_value
            bool_value = 'False' if field_val.bool_value == False else 'True'
            l = [string_value,timestamp_value,enum_val,richtext_value,double_value,bool_value]
            res = next((sub for sub in l if sub),field_val.bool_value)
            result_fields.append({
                "field_key":field_key,
                "field_value": res
            })
        result_map={ "tag_name": entry_tag.template_display_name, "tag_fields" : result_fields }
       
        response.append(result_map)
    print(json.dumps(response,  default=str))
    return json.dumps(response,  default=str)


@app.route('/search', methods=['GET'])
def search():
    args=request.args
    search_string_arg=args.get("search-string")

    client = datacatalog_v1.DataCatalogClient()

    search_string = f"{search_string_arg} and tag:data_product_ownership"
    scope1 = datacatalog_v1.types.SearchCatalogRequest.Scope()
    scope1.include_org_ids.append("989067243343")
    search_results = client.search_catalog(scope=scope1, query=search_string)

    #page_result = client.search_catalog(request=request)

    response=[]

    #print("Results in project:")
    for result in search_results:
        print(result)
        m = re.match(r"^(?P<uri>.+?)/projects/(?P<project>.+?)/(?P<type>.+?)/(?P<name>.+?)$",
            result.linked_resource,
        )  
        #print(result.linked_resource)

        result_map={ 
            "name": m['name'].rsplit('/',1)[-1],
            "project":m['project'],
            "type":result.search_result_type,
            "search_result_type":result.search_result_subtype.rsplit('.',1)[-1], 
            "integrated_system":result.integrated_system.name,
            "fully_qualified_name": result.fully_qualified_name,
            "modify_time":result.modify_time,
            "linked_resource":result.linked_resource
            }
        response.append(result_map)
        
    #print(json.dumps(response))
    return json.dumps(response ,default=str)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
    #search()

