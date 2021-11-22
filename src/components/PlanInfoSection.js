import {useState} from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import config from '../config/config'

const PlanInfoSection = ({auth, enrolledMemberApiData}) => {
  const [apiData, setApiData] = useState(null);

  const planId = (enrolledMemberApiData || {}).planName || '';

  const buttonOnClick = () => {
    var headers = {
      'Content-Type': 'application/json'
    };
    var reqBody = {
      'planId': planId
    };

    fetch(config.planInfoApiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(reqBody)
    })
      .then(res => {
        if(res.status === 200) return res.json()
        else return {status: res.status, statusText: res.statusText}
      })
      .then(
        (result) => {
          setApiData(result);
        },
        (error) => {
          // setErrorString(`${error.name}: ${error.message}`);
        }
      );
  };

  return (
    <div>
      {!apiData
        ? !!auth
          ? planId.length > 0
            ? <Button variant="contained" onClick={() => buttonOnClick()}>Fetch Plan using id &quot;{planId}&quot;</Button>
            : <Button disabled variant="contained">Fetch Enrollment first</Button>
          : <Button disabled variant="contained">Authenticate to Fetch Plan</Button>
        : <PlanInfo data={apiData} />
      }
    </div>
  );
}

const PlanInfo = ({data}) => {
  return (
    <div className="PlanInfo">
      <h3 className="PlanInfoHeader">Plan Info</h3>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Plan Name</TableCell>
            <TableCell>{data.planName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Effective Date</TableCell>
            <TableCell>{data.effectiveDate}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Policy</TableCell>
            <TableCell>{data.Policy}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Policy Status</TableCell>
            <TableCell>{data.PolicyStatus}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

    </div>
  );
}

export default PlanInfoSection;
