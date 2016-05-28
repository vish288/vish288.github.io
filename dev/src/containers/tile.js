/**
 * Created by vsury1 on 5/27/16.
 */
import React from "react";
import {brown600} from "material-ui/styles/colors";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from "material-ui/Card";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

const brownTheme = getMuiTheme({
    palette: {
        accentColor: brown600
    }
});

export default class Tile extends React.Component {
    render() {
        const tile = this.props.tile;
        return (<MuiThemeProvider muiTheme={brownTheme} className="col-xs-4">
            <Card>
                <CardHeader
                    title={tile.name}
                    subtitle="Subtitle"
                />
            </Card>
        </MuiThemeProvider>)
    }
}