import {
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
} from '@mui/material';
import {makeStyles} from '@mui/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import authConfig from '../config/authConfig';
import jwt from 'jsonwebtoken';

const useStyles = makeStyles({
  root: {
    border: '1px solid black',
    marginTop: 30,
    padding: 10,
    width: '33%'
  },
  accessTokenValue: {
    width: '100%'
  },
  welcomeMessage: {
    textAlign: 'center',
    padding: 5
  }
});

const AccessTokenDisplay = ({auth}) => {
  const classes = useStyles();
  const accessTokenRaw = localStorage.getItem(authConfig.accessTokenName);
  const accessTokenDisplay = !!auth ? accessTokenRaw || '<not set>': '<not set>';
  const token = !!auth ? (jwt.decode(accessTokenRaw) || {}) : {};
  const claimsRows = Object.entries(token).reduce((acc, [key, value]) => {
    var arrayValue = [].concat(value);
    return acc.concat(arrayValue.map((eachValue, innerIdx) => {
      var idx = acc.length + innerIdx;
      return (
        <TableRow key={idx}>
          <TableCell>{key}</TableCell>
          <TableCell>{eachValue}</TableCell>
        </TableRow>
      );
    }));
  }, [])

  return (
    <Card className={classes.root}>
      <TextField className={classes.accessTokenValue} variant='outlined' label='Access Token from authentication' value={accessTokenDisplay} InputProps={{ readOnly: true }} />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
          <div>Claims</div>
        </AccordionSummary>
        <AccordionDetails>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {claimsRows}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
    </Card>
  );

}

export default AccessTokenDisplay;
