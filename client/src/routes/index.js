import React  from 'react';
import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import '../App.css';
import { Button,Input, Image,Segment, Divider} from 'semantic-ui-react'
import CustomGrid from '../components/CustomGrid';
import { useHistory, useLocation, Link } from "react-router-dom";
import * as Constants from './staticcontent';

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }



export default function () {
    //const { search } = window.location;
    //const query = new URLSearchParams(search).get('s');
    let history = useHistory();
    const [searchQuery, setSearchQuery] = useState('');

    const goToSearch = () => {
        if (searchQuery) {
            history.push(`/search-results?q=${encodeURIComponent(searchQuery)}`);
        }

    }

      //<img src={logo} className="App-logo" alt="logo" />
    //const BarStyling = {width:"40rem",background:"#F2F1F9", border:"none", padding:"0.5rem"};
    return (
        <>
            <div className="App">
            <div id="content" >
                <Segment>
                <Image src={require("../assets/marketplace-logo.svg")} size='tiny' floated='left' />
                <p style={{textAlign:"left",fontSize: "x-large", lineHeight: "3.5em"}}> Data Marketplace </p>
                </Segment>
                </div>
                <Divider hidden />
                <Input
                    icon='search'    
                    value={searchQuery}
                    onInput={(e) => setSearchQuery(e.target.value)}
                    type="text"
                    id="header-search"
                    placeholder="Search for a data product..."
                    name="s"
                    size="large"
                    >
                        <input />
                    <Button  onClick={() => goToSearch()} size='large'>Search</Button>
                    </Input>
            
                    <Divider hidden />
                    <Divider horizontal>Or Search by domain</Divider>
                    <Divider hidden />
                {Constants.staticDisplayGrid && <CustomGrid list={Constants.staticDisplayGrid}/>}


            </div>
        </>
    );
};

//export default App;