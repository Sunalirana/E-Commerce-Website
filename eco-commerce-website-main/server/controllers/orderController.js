exports.placeOrder = async (req, res) => {
  try {
    const { items, total } = req.body;
    const order = {
      _id: Date.now().toString(),
      user: req.user.id,
      items,
      total,
      createdAt: new Date()
    };

    global.orders.push(order);

    // Award points for each dollar spent
    const points = Math.floor(total); // 1 point per $1
    const user = global.users.find(u => u._id === req.user.id);
    if (user) {
      user.points += points;
    }

    res.status(201).json({ message: 'Order placed!', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSoldProducts = async (req, res) => {
  try {
    // Get all unique products that have been sold
    const soldProductIds = new Set();
    const soldProductsWithQuantity = {};

    global.orders.forEach(order => {
      order.items.forEach(item => {
        soldProductIds.add(item._id || item.id);
        if (soldProductsWithQuantity[item._id || item.id]) {
          soldProductsWithQuantity[item._id || item.id] += item.quantity || 1;
        } else {
          soldProductsWithQuantity[item._id || item.id] = item.quantity || 1;
        }
      });
    });

    // Get full product details for sold products
    const soldProducts = global.products
      .filter(product => soldProductIds.has(product._id))
      .map(product => ({
        ...product,
        soldQuantity: soldProductsWithQuantity[product._id] || 0,
        isSold: true
      }));

    res.json(soldProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};