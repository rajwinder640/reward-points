import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import userDetails from './userDetails.json';
const _ = require('lodash');
const columns = [
  { id: 'customerId', label: 'Customer ID', minWidth: 100, align: 'center' },
  { id: 'customerName', label: 'Customer Name', minWidth: 150, align: 'center' },
  { id: 'monthWiseSpend', label: 'Monthly Reward', minWidth: 100, align: 'center' }
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  tableIcons: {
    cursor: 'pointer'
  }
});

function App() {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userDetailsState, setUserDetails] = useState(null);

  useEffect(() => {
    calculateCreditPoints();
  }, [])

  const calculateCreditPoints = () => {
    const finalResult = [];
    let details = {};
    let monthlySpend = {};
    const customer = groupBy(userDetails, 'customerId');
    Object.keys(customer).forEach(f => {
      monthlySpend = {};
      details = {};
      const months = groupBy(customer[f], 'transactionDate');
      details['customerId'] = f;
      details['customerName'] = customer[f][0].customerName;
      Object.keys(months).forEach(m => {
        let mon = getMonth(JSON.parse(JSON.stringify(m)));
        monthlySpend[mon] = calculatePoints(addAmount(months[m], 'transactionAmount'));
      });
      details['monthWiseSpend'] = JSON.stringify(monthlySpend);
      finalResult.push(details);
    })
    setUserDetails(finalResult);
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const groupBy = (objectArray, property) => {
    const result = _.groupBy(objectArray, function (mon) {
      return mon[property];
    });
    return result;
  }

  const getMonth = (date) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const d = new Date(date);
    return monthNames[d.getMonth()] + '-' + d.getFullYear();
  }

  const addAmount = (items, prop) => {
    return items.reduce(function (a, b) {
      return a + b[prop];
    }, 0);
  }

  const calculatePoints = (data) => {
    let result = 0;
    if (data > 50 && data > 100) {
      const hundred = (data - 100) * 2;
      const fifty = (data - 50) * 1;
      result = hundred + fifty;
    } else {
      result = 0;
    }
    return result;
  }

  return (
    <>
      <h1>Reward Points</h1>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    <strong>{column.label}</strong>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {userDetailsState && userDetailsState.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                return (
                  <TableRow tabIndex={-1} key={index}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={userDetails && userDetails.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  )
}

export default App;
