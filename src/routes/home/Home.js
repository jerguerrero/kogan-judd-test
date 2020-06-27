import React, {useState, useEffect} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

const CATEGORY_TO_LOOK_FOR = 'Air Conditioners';

const Home = () => {

    const [nextPage, setNextPage] = useState('/api/products/1');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averageCubicWeight, setAverageCubicWeight] = useState(0);

    useEffect(() => {
        //Source https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe/43881141 bypass CORS
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = 'http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com' + nextPage; // site that doesn’t send Access-Control-*
        fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
            .then(response => response.json())
            .then(jsonResponse => {
                const next = jsonResponse.next;
                const products = jsonResponse.objects;


                const filteredProductsFromPage = products? products.filter(product => product.category === CATEGORY_TO_LOOK_FOR) : null;

                const aggregatedProducts = filteredProducts.concat(filteredProductsFromPage);
                setFilteredProducts(aggregatedProducts);

                if(!!next){
                    setNextPage(next);
                }
                else{
                    const aggregatedVolume = aggregatedProducts.reduce((acc, cur, idx, src) => {
                        const volume = (cur.size.length/100 * cur.size.width/100 * cur.size.height/100) * 250;
                        return acc + volume
                    }, 0);
                    setAverageCubicWeight((aggregatedVolume/(aggregatedProducts.length)).toFixed(2));
                    setLoading(false);
                }
            })
            .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
        // eslint-disable-next-line
    }, [nextPage]);

    if(loading) {
        return (
            <Container maxWidth="lg">
                <CircularProgress/>
            </Container>
        );
    }
    return (
        <Container maxWidth="lg">
            <TableContainer component={Paper}>
                <Table aria-label="products table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Category</TableCell>
                            <TableCell align="right">Weight</TableCell>
                            <TableCell align="right">Width</TableCell>
                            <TableCell align="right">Length</TableCell>
                            <TableCell align="right">Height</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.title}>
                                <TableCell component="th" scope="row">
                                    {product.title}
                                </TableCell>
                                <TableCell align="right">{product.category}</TableCell>
                                <TableCell align="right">{product.weight}</TableCell>
                                <TableCell align="right">{product.size.width}</TableCell>
                                <TableCell align="right">{product.size.length}</TableCell>
                                <TableCell align="right">{product.size.height}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {'The average cubic weight for ' + CATEGORY_TO_LOOK_FOR + ' is ' + averageCubicWeight + 'kg'}
        </Container>
  );
};

export default Home;
