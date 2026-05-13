import UserRouter from "./UserRouter.js";
import CatagorypropertyRouter from "./CatagorypropertyRouter.js";
import ListingRouter from "./ListingRouter.js";
import ImageListingRouter from "./ImageListingRouter.js"
import HomeRouter from "./HomeRouter.js";
import favoriteRouter from "./favoriteRouter.js";
import DashboardRouter from "./DashboardRouter.js";
import ContractRouter from "./ContractRouter.js";
import StatisticalRouter from "./StatisticalRouter.js";
const routes = (app) => {
    app.use('/api/user',UserRouter);
    app.use('/api/catagory_property',CatagorypropertyRouter);
    app.use('/api/Listing',ListingRouter);
    app.use('/api/home',HomeRouter);
    app.use("/api/ImageListing",ImageListingRouter);
    app.use("/api/Favorite",favoriteRouter);
    app.use("/api/Dashboard",DashboardRouter);
    app.use("/api/Contract",ContractRouter);
    app.use("/api/Statistical",StatisticalRouter);
}
module.exports = routes;
