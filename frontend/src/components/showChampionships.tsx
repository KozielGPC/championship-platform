import React, { useEffect, useState } from 'react';
import {Box} from '@chakra-ui/react';
import { Championship } from '@/interfaces';
import ChampionshipPreview from './championshipPreview';


interface ChampionshipProps {
  championships: Array<Championship>;
}

const ShowChampionships: React.FC<ChampionshipProps> = ({ championships }) => {

  const [championships_state, setChampionships] = useState(Array<Championship>);

  useEffect(
    () => {
        setChampionships(championships);
    },[championships]
  )
 
  return (
        <Box>
            {championships_state ? championships_state.map((championship, index) => <ChampionshipPreview key={index} championship={championship}></ChampionshipPreview>)
                    :<></>}
        </Box>
  );
};


export default ShowChampionships;