import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Products from "./pages/Products";
import AddProducts from "./pages/AddProducts";
import { ProductInfo } from "./components/products/ProductInfo";
import { ProductPrice } from "./components/products/ProductPrice";
import Orders from "./pages/Orders";
import ProductSpecs from "./components/products/ProductSpecs";
import { ProductCoupons } from "./components/products/ProductCoupons";
import Shipments from "./pages/Shipments";
import PrivateRoute from "./pages/PrivateRoute";
import Users from "./pages/Users";
import ConfigureCoupons from "./pages/ConfigureCoupons";
import PaymentGateway from "./pages/PaymentGateway";
import ShipmentsDetails from "./pages/ShipmentsDetails";
import Categories from "./pages/Categories";
import AddCategory from "./pages/AddCategory";
import MyProfile from "./pages/MyProfile";
import EditProducts from "./pages/EditProducts";
import ProductSEO from "./components/products/ProductSEO";
import Settings from "./pages/Settings";
import UserSentiment from "./pages/UserSentiment";
import Blogs from "./pages/Blogs";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import UserHistory from "./pages/UserHistory";

dayjs.extend(utc);
dayjs.extend(timezone);

function App() {
  // const [mode] = useMode();

  // darkmode

  // useEffect(() => {
  //   if (mode === "dark") {
  //     document.documentElement.classList.toggle("dark", true);
  //   } else {
  //     document.documentElement.classList.toggle("dark", false);
  //   }
  // }, [mode]);

  return (
    <Routes>
      <Route path="/" element={<PrivateRoute />}>
        <Route index element={<Home />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/add" element={<AddProducts />}>
          <Route path="product-info" element={<ProductInfo />} />
          <Route path="product-price" element={<ProductPrice />} />
          <Route path="product-specs" element={<ProductSpecs />} />
          <Route path="discounts" element={<ProductCoupons />} />
          <Route path="seo" element={<ProductSEO />} />
        </Route>
        <Route path="/products/edit" element={<EditProducts />}>
          <Route path="product-info" element={<ProductInfo />} />
          <Route path="product-price" element={<ProductPrice />} />
          <Route path="product-specs" element={<ProductSpecs />} />
          <Route path="discounts" element={<ProductCoupons />} />
          <Route path="seo" element={<ProductSEO />} />
        </Route>
        <Route path="/categories" element={<Categories />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/orders" element={<Orders />} />

        <Route path="/shipments" element={<Shipments />} />
        <Route
          path="/shipment-details/:shipmentId"
          element={<ShipmentsDetails />}
        />
        <Route path="/users" element={<Users />} />
       <Route path="/user-history/:id" element={<UserHistory />} />

        <Route path="/configure-coupons" element={<ConfigureCoupons />} />
        <Route path="/payment-gateway" element={<PaymentGateway />} />
        <Route path="/user-sentiment" element={<UserSentiment/>}/>
                <Route path="/blogs" element={<Blogs/>}/>
        <Route path="/blogs/create" element={<CreateBlog/>}/>
        <Route path="/blogs/edit" element={<EditBlog/>}/>

      </Route>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="*" element={<p>no routes found</p>} />
    </Routes>
  );
}

export default App;
