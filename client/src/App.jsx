import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getUserDataFirst } from "./redux/actions/userActions";
import { Toaster } from "react-hot-toast";
import Home from "./pages/public/Home";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import ValidateOTP from "./pages/auth/ValidateOTP";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Contact from "./pages/public/Contact";
import About from "./pages/public/About";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import AdminHome from "./pages/admin/pages/AdminHome";
import AdminDash from "./pages/admin/Dashboard";
import SIdeNavbar from "./pages/admin/components/SIdeNavbar";
import CreateCategory from "./pages/admin/pages/categories/CreateCategory";
import Categories from "./pages/admin/pages/categories/Categories";
import EditCategory from "./pages/admin/pages/categories/EditCategory";
import AddProducts from "./pages/admin/pages/products/AddProducts";
import Products from "./pages/admin/pages/products/Products";
import EditProduct from "./pages/admin/pages/products/EditProduct";
import Customers from "./pages/admin/pages/customers/Customers";
import ProductDetails from "./pages/user/pages/ProductDetails";
import Cart from "./pages/user/cart/Cart";

function App() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(getUserDataFirst());
    }
  }, [dispatch, user]);
  const ProtectedRoute = ({ element }) => {
    const { user } = useSelector((state) => state.user);
    return user ? element : <Navigate to="/login" />;
  };
  return (
    //user routes
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        {user ? user.role === "user" && <Navbar /> : <Navbar />}

        <Routes>
          <Route
            path="/"
            element={
              user ? (
                user.role === "admin" || user.role === "superAdmin" ? (
                  <Navigate to="/admin" />
                ) : (
                  <Dashboard />
                )
              ) : (
                <Home />
              )
            }
          />
          {/* user routes */}
          <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Admin Routes */}
          {(user && user.role === "admin") ||
          (user && user.role === "superAdmin") ? (
            <Route path="/admin/*" element={<AdminRoutes />} />
          ) : (
            <Route path="/admin" element={<Navigate to="/" />} />
          )}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<ValidateOTP />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
        {user ? user.role === "user" && <Footer /> : <Footer />}
      </BrowserRouter>
    </>
  );
}
function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDash />}>
        <Route index element={<AdminHome />} />
        {/* cateogories */}
        <Route path="categories" element={<Categories />} />
        <Route path="categories/create" element={<CreateCategory />} />
        <Route path="categories/edit/:id" element={<EditCategory />} />
        {/* product */}
        <Route path="product" element={<Products />} />
        <Route path="product/create" element={<AddProducts />} />
        <Route path="product/edit/:id" element={<EditProduct />} />
        {/* users management */}
        <Route path="customers" element={<Customers />} />
      </Route>
    </Routes>
  );
}

export default App;
