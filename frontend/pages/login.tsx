import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import styles from '../styles/login.module.css'
import { style } from '@mui/system';

export default function loginContainer() {
	// const mystyle = {
	// 	width: '100%',
	// 	height: '100%',
	// 	display: 'flex',
	// 	flexDirection: 'column',
	// 	alignItems: 'center',
	// 	justifyContent: 'center',
	//   };
	return (
    <div id={styles.loginContainer}>
       <Button variant="contained">42 Login</Button>
       <Button variant="outlined">Guest</Button>
	</div>
  );
}


// export default function BasicButtons() {
//   return (
//     <Stack spacing={2}>
//       <Button variant="contained">42 Login</Button>
//       <Button variant="outlined">Guest</Button>
//     </Stack>
//   );
// }

// export default function BoxSx() {
//   return (
//     <Box
//       sx={{
//         width: 300,
//         height: 300,
//         backgroundColor: 'primary.dark',
//       }}
//     />
//   );
// }

// loginContainer.getLayout = function getLayout(chat: ReactElement) {
// 	return (<>{chat}</>
// 	)
//   }
  

