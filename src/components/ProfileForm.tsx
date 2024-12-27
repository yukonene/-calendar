import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


export const ProfileForm=()=>{
    return (
        <Box
        component="form"
        sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
        noValidate
        autoComplete="off"
      >
        
        <div>
        <TextField
          required
          id="outlined-required"
          label="名前"
        
        />
          <TextField
            id="outlined-multiline-flexible"
            label="イベント参加地域"
            multiline
            maxRows={4}
          />
          <TextField
            id="outlined-textarea"
            label="Multiline Placeholder"
            placeholder="Placeholder"
            multiline
          />
            <TextField
            id="outlined-textarea"
            label="Multiline Placeholder"
            placeholder="Placeholder"
            multiline
          />
                 <TextField
            id="outlined-textarea"
            label="Multiline Placeholder"
            placeholder="Placeholder"
            multiline
          />
          <TextField
            id="outlined-multiline-static"
            label="Multiline"
            multiline
            rows={4}
            defaultValue="Default Value"
        
          />
        </div>
       
      </Box>
      );
}