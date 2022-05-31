import React from "react";
import { Grid, Table, Loader,Segment, Header, Icon } from 'semantic-ui-react'


const CustomTable = (props) => {
    const [selectedRow, setSelectedRow ] = React.useState(null);
    const callFetchTagAPI = (linked_resource) => {
        console.log(linked_resource)
   
    }
    const rowClick = (row, index) => {
        console.log("selected index: ", index);
        console.log("selected row: ", row);
        setSelectedRow(index);
        if(row){
            props.setIsTagLoading(true);
            
            // Replace API Calls here
            
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ linked_resource: row["linked_resource"] })
            };
         fetch('/fetch-tags', requestOptions)
                .then(response => response.json())
                .then(data =>{
                    props.setTagRows(data);
                    props.setIsTagLoading(false);

                });
            

            
        }
    };
    return (
        <>
            <Table basic='very' textAlign='center' size='large'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Project</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Category</Table.HeaderCell>
                        <Table.HeaderCell>System</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        props.rows ? 
                            props.rows.map((row, index) => 
                                <Table.Row key={row["linked_resource"]} positive={selectedRow === index}>
                                    <Table.Cell><a href='#' onClick={()=> {
                                        rowClick(row, index);
                                    }}>{row["name"]}</a></Table.Cell>
                                    <Table.Cell>{row["project"]}</Table.Cell>
                                    <Table.Cell>{row["type"]}</Table.Cell>
                                    <Table.Cell>{row["search_result_type"]}</Table.Cell>
                                    <Table.Cell>{row["integrated_system"]}</Table.Cell>
                                </Table.Row>)
                             :
                            <Table.Row>
                                <Table.Cell colSpan="5">No results to display</Table.Cell>
                            </Table.Row>
                    }
                </Table.Body>
            </Table>
        </>
    );
}

const CustomSideBar = (props) => {
    if(props.isLoading){
        return <Loader active inline='centered' size='medium'>Loading Tags</Loader>;
    }
    return (
        <>
        <Grid columns={1} style={{paddingLeft: '1em', paddingRight: '1em'}}>
            { props.tagRows &&
                props.tagRows.map(tagRow => {
                    return (<Grid.Row>
                        <Grid.Column textAlign="left">
                            <Segment raised inverted>
                                <Header as='h4' icon='tag'>
                                    <Icon name='tag'/>
                                    {tagRow["tag_name"]}
                                </Header>
                                <Table singleLine inverted color="black" size="small">
                                    <Table.Row textAlign="center">
                                        <Table.HeaderCell>Tag</Table.HeaderCell>
                                        <Table.HeaderCell>Value</Table.HeaderCell>
                                    </Table.Row>
                                    {tagRow.tag_fields ? 
                                        tagRow.tag_fields.map(tagFieldRow => (<Table.Row>
                                            <Table.Cell>{tagFieldRow["field_key"]}</Table.Cell>
                                            <Table.Cell>{tagFieldRow["field_value"]}</Table.Cell>
                                        </Table.Row>)):
                                        <Table.Row textAlign="center">
                                            <Table.Cell colSpan={2}>No tags fields to display</Table.Cell>
                                        </Table.Row>
                                    }
                                </Table>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>);
                })
            }
            {!props.tagRows && <Grid.Row>
                    <Grid.Column textAlign="center">
                        No tags to display
                    </Grid.Column>
                </Grid.Row>}
        </Grid>
        </>
    );
}

export default function CustomSearchResults(props) {
    const [ tagRows, setTagRows ] = React.useState(null);
    const [ isTagLoading, setIsTagLoading ] = React.useState(false);
    return (
        <Grid stackable style={{paddingTop: "2em"}}>
              <Grid.Row columns='equal'>
                  <Grid.Column width={3}></Grid.Column>
                  <Grid.Column>
                    <CustomTable rows={props.rows} parentOnRowClick={props.parentOnRowClick} setTagRows={setTagRows} setIsTagLoading={setIsTagLoading} />
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Header as='h4'>Data Tags</Header>
                    <CustomSideBar tagRows={tagRows} isLoading={isTagLoading}/>
                  </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}