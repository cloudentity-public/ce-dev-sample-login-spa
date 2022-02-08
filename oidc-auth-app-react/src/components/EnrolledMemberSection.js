import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

const EnrolledMemberSection = ({auth, enrolledMemberApiData}) => {
  return (
    <div>
      {!enrolledMemberApiData
        ? !!auth
          ? <div>Fetching...</div>
          : <div>Authenticate to fetch enrollment</div>
        : <EnrolledMemberInfo data={enrolledMemberApiData} />
      }
    </div>
  );
}

const EnrolledMemberInfo = ({data}) => {
  return (
    <div className="EnrolledMemberInfo">
      <h3 className="EnrolledMemberHeader">Enrolled Member Info</h3>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Plan Sponsor Number</TableCell>
            <TableCell>{data.PlanSponsorNumber}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Plan Name</TableCell>
            <TableCell>{data.planName}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

    </div>
  );
}

export default EnrolledMemberSection;
