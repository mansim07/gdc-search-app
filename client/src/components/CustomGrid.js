import React from "react";
import { Grid } from 'semantic-ui-react';
import CustomCard from "./CustomCard";
import './CustomGrid.css';

export default function CustomGrid(props) {
    const list = props.list;
    return (
        <Grid className="container" columns={3} stackable relaxed>
        {list && list.map(item => 
          <Grid.Column className="col" key={item.linked_resource}>
            <CustomCard className="item" item={item}/>
          </Grid.Column>
        )}
    </Grid>
    );
  }