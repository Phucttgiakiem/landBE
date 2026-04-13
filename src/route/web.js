import UserRouter from "./UserRouter.js";
import CatagorypropertyRouter from "./CatagorypropertyRouter.js";
import ListingRouter from "./ListingRouter.js";
import ImageListingRouter from "./ImageListingRouter.js"
import HomeRouter from "./HomeRouter.js";
const routes = (app) => {
    app.use('/api/user',UserRouter);
    app.use('/api/catagory_property',CatagorypropertyRouter);
    app.use('/api/Listing',ListingRouter);
    app.use('/api/home',HomeRouter);
    app.use("/api/ImageListing",ImageListingRouter);
}
module.exports = routes;
