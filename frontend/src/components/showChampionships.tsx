import React, { useEffect, useState } from 'react';
import {Box, Grid, GridItem} from '@chakra-ui/react';
import { Championship } from '@/interfaces';
import ChampionshipPreview from './championshipPreview';


interface ChampionshipProps {
  championships: Array<Championship>;
}

const ShowChampionships: React.FC<ChampionshipProps> = ({ championships }) => {


  return (
        <Grid templateColumns='repeat(3, 1fr)' >
          {
          championships ? championships.map((championship, index) =>{
            return(
                  <GridItem key={'index'}>
                      <ChampionshipPreview key={index} championship={championship}></ChampionshipPreview>
                  </GridItem>
            )
          }) 
          : <Box>No championships</Box>
          }
        </Grid>
  );
};


export default ShowChampionships;