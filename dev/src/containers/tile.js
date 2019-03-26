import React from 'react'
import { red } from '@material-ui/core/colors'
import { Avatar, Card, CardHeader } from '@material-ui/core'

const Tile = ({ tile }) => {
  return (<Card className="col-xs-4">
    <CardHeader
      title={tile.name}
      subtitle={tile.url}
      avatar={
        <Avatar aria-label={tile.owner.login}
                style={{ backgroundColor: red['500'] }}>
          {tile.owner.login.substring(0, 1)}
        </Avatar>
      }
      style={{
        backgroundColor: red['2'],
      }}
    />
  </Card>)
}

export default Tile