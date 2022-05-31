import React  from 'react';
import { Card, Image } from 'semantic-ui-react';
import './CustomCard.css';
import { useHistory } from "react-router-dom";
//<Card.Img variant="top" src={require(`../assets/DataProductImg1.svg`)}/>
export default function CustomCard(props) {
    const item = props.item;
    let history = useHistory();

    const onClick = () => {
        if(item.link_to){
            history.push(item.link_to)
            //history.push("/hello")
        }
    };
    return (
        <>
      <Card className="item" onClick={onClick} style={{height:"25em", width:"40em"}}>
                <Image src={require(`../assets/${item.img}`)} style={{width: "35em", height: "12em", objectFit: "cover"}}/>
                <Card.Content>
                    <Card.Header>{item.title}</Card.Header>
                    <Card.Description style={{maxHeight:"7em" , overflow: "auto", overflowX: "hidden"}}>{item.text}</Card.Description>
                </Card.Content>
            </Card>
        </>
    );
}