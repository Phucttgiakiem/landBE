export const attachFavorite = (list,favSet) => {
  return list.map(item => ({
    ...item,
    isFavorite: favSet.has(item._id.toString())
  }));
};
export const convertdateformongodb = (dateString) => {

    if (!dateString) return null;

    const [day, month, year] = dateString.split("/");

    return new Date(`${year}-${month}-${day}`);

}
