import React, { useMemo, useContext, useState, useEffect } from "react";
import { products } from "../utils/Product";
import { symbolPrevent } from "../utils/symbolPrevent";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { formatter } from "../utils/PriceFormatter";
import { AppContext } from "../context/AppContext";

const AllProducts = () => {
  const { filters, setFilters, openNotification, cart, setCart } =
    useContext(AppContext);
  const [shoppingItems, setShoppingItems] = useState(products);
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");

  const brands = useMemo(() => {
    const brandsMapping = products.map((p) => p.brand);

    return [...new Set(brandsMapping)];
  }, []);

  const categories = useMemo(() => {
    const categoriesMapping = products.map((p) => p.category);

    return [...new Set(categoriesMapping)];
  }, []);

  useEffect(() => {
    if (filters.categoryLink) {
      const productsFilter = products.filter(
        (p) => p.category === filters.categoryLink
      );

      setShoppingItems(productsFilter);
    }
  }, []);

  return (
    <section className="all-products-container">
      <div className="all-products-inner-container">
        <div className="all-products-grid">
          <div className="all-products-text">
            <h1 className="all-products-title">Products</h1>
            <div className="all-products-total">
              {shoppingItems.length} item(s)
            </div>
          </div>
          <div className="all-products-filters">
            <div style={{ maxHeight: 300, overflow: "auto" }}>
              <section className="all-products-filters-prices">
                <h4 className="all-products-filters-prices-title">Prices</h4>
                <div className="all-products-filters-price-range">
                  <div className="all-products-filters-price-flex">
                    <div className="all-products-filters-price-first">
                      <div className="all-products-filters-price-inline">
                        <span className="all-products-filters-price-icon">
                          from
                        </span>
                        <input
                          className="all-products-filters-price-from-to"
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="$59"
                          value={fromValue}
                          onKeyDown={(e) => {
                            if (symbolPrevent.includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          onPaste={(e) => {
                            if (
                              symbolPrevent.includes(
                                e.clipboardData.getData("Text")
                              )
                            ) {
                              e.preventDefault();
                            }
                          }}
                          onBlur={(e) => {
                            setFromValue(
                              e.target.value.replace(/^0+(?=\d)/, "")
                            );
                          }}
                          onChange={(e) => {
                            let value = parseFloat(e.target.value);

                            setFromValue(isNaN(value) ? "" : value);
                            setFilters({
                              ...filters,
                              prices: {
                                ...filters.prices,
                                from: isNaN(value) ? "" : value,
                              },
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="all-products-filters-price-second">
                      <div className="all-products-filters-price-inline">
                        <span className="all-products-filters-price-icon">
                          to
                        </span>
                        <input
                          className="all-products-filters-price-from-to"
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="$6559"
                          value={toValue}
                          onKeyDown={(e) => {
                            if (symbolPrevent.includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          onPaste={(e) => {
                            if (
                              symbolPrevent.includes(
                                e.clipboardData.getData("Text")
                              )
                            ) {
                              e.preventDefault();
                            }
                          }}
                          onBlur={(e) => {
                            setToValue(e.target.value.replace(/^0+(?=\d)/, ""));
                          }}
                          onChange={(e) => {
                            let value = parseFloat(e.target.value);

                            setToValue(isNaN(value) ? "" : value);
                            setFilters({
                              ...filters,
                              prices: {
                                ...filters.prices,
                                to: isNaN(value) ? "" : value,
                              },
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="all-products-filters-brands">
                <h4 className="all-products-filters-brands-title">Brands</h4>
                <div className="all-products-filters-brands-content">
                  <ul className="all-products-filters-brands-checkboxes">
                    {brands.map((b, i) => (
                      <li key={i}>
                        <input
                          id={`brand-${i + 1}`}
                          type="checkbox"
                          name={b}
                          checked={filters.brands.includes(b) ? true : false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({
                                ...filters,
                                brands: [...filters.brands, b],
                              });
                            } else {
                              const filtersDelete = filters.brands.filter(
                                (brand) => brand !== b
                              );
                              setFilters({ ...filters, brands: filtersDelete });
                            }
                          }}
                          className="all-products-filters-brands-type-checkbox"
                        />
                        <label
                          htmlFor={`brand-${i + 1}`}
                          className="all-products-filters-brands-type-label"
                        >
                          <span>{b}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
              <section className="all-products-filters-type">
                <h4 className="all-products-filters-type-title">Type</h4>
                <div className="all-products-filters-type-content">
                  <ul className="all-products-filters-type-list">
                    {categories.map((c, i) => (
                      <li key={i}>
                        <input
                          id={`category-${i + 1}`}
                          type="checkbox"
                          name={c}
                          checked={filters.types.includes(c) ? true : false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({
                                ...filters,
                                types: [...filters.types, c],
                              });
                            } else {
                              const filtersDelete = filters.types.filter(
                                (type) => type !== c
                              );
                              setFilters({ ...filters, types: filtersDelete });
                            }
                          }}
                          className="all-products-filters-brands-type-checkbox"
                        />
                        <label
                          htmlFor={`category-${i + 1}`}
                          className="all-products-filters-brands-type-label"
                        >
                          <span>{c}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
            <div className="all-products-filters-type-button-group">
              <Button
                type="primary"
                style={{ marginRight: 10, padding: 19 }}
                onClick={() => {
                  let fromPrice = filters.prices.from;
                  let toPrice = filters.prices.to;

                  if (typeof fromPrice === "string") {
                    fromPrice = 0;
                  }

                  if (typeof toPrice === "string") {
                    toPrice = 0;
                  }

                  if (fromPrice > 0 && toPrice > 0 && fromPrice > toPrice) {
                    openNotification(
                      "error",
                      "Error",
                      "From Price cannot be greater than To Price"
                    );

                    return;
                  }

                  let shoppingFilters = products;

                  if (fromPrice > 0 && toPrice > 0) {
                    shoppingFilters = shoppingFilters.filter(
                      (si) => si.price >= fromPrice && si.price <= toPrice
                    );
                  } else if (fromPrice > 0) {
                    shoppingFilters = shoppingFilters.filter(
                      (si) => si.price >= fromPrice
                    );
                  } else if (toPrice > 0) {
                    shoppingFilters = shoppingFilters.filter(
                      (si) => si.price <= toPrice
                    );
                  }

                  if (filters.brands.length > 0) {
                    shoppingFilters = shoppingFilters.filter((sf) =>
                      filters.brands.includes(sf.brand)
                    );
                  }

                  if (filters.types.length > 0) {
                    shoppingFilters = shoppingFilters.filter((sf) =>
                      filters.types.includes(sf.category)
                    );
                  }

                  setShoppingItems(shoppingFilters);
                  openNotification(
                    "success",
                    "Success",
                    "Filter Products Success"
                  );
                }}
              >
                FILTER
              </Button>
              <button
                className="all-products-filters-type-reset-button"
                onClick={() => {
                  setFromValue("");
                  setToValue("");
                  setFilters({
                    prices: {
                      from: "",
                      to: "",
                    },
                    brands: [],
                    types: [],
                    categoryLink: "",
                  });
                  setShoppingItems(products);
                  openNotification(
                    "success",
                    "Success",
                    "Reset filters Success"
                  );
                }}
              >
                <span className="all-products-filters-type--reset-icon">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    className="all-products-filters-type-reset-svg"
                  >
                    {" "}
                    <path
                      fill="none"
                      stroke="#000"
                      strokeWidth="1.06"
                      d="M16,16 L4,4"
                    ></path>{" "}
                    <path
                      fill="none"
                      stroke="#000"
                      strokeWidth="1.06"
                      d="M16,4 L4,16"
                    ></path>
                  </svg>
                </span>
                Reset all filters
              </button>
            </div>
          </div>
          <div className="all-products-filter-media">
            {shoppingItems.length === 0 ? (
              <h1 style={{ textAlign: "center", fontSize: "3rem" }}>
                There are no related shopping items
              </h1>
            ) : (
              <div className="all-products-filter-media-grid">
                <div className="all-products-media">
                  <div className="all-products-media-child">
                    <div className="all-products-media-items">
                      <div className="all-products-media-items-cards">
                        <div className="all-products-media-items-collapse">
                          <div className="all-products-media-column">
                            <div className="all-products-media-inner-collapse">
                              {shoppingItems.map((p) => (
                                <article
                                  key={p.id}
                                  className="all-products-media-item"
                                >
                                  <div className="all-products-media-header">
                                    <div className="all-products-media-image">
                                      <Link
                                        to={`/products/${p.id}`}
                                        className="all-products-media-link"
                                      >
                                        <figure className="all-products-media-figure">
                                          <img
                                            src={p.image}
                                            alt={p.title}
                                            className="all-products-media-inner-image"
                                          />
                                        </figure>
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="all-products-media-body">
                                    <div>
                                      <div className="all-products-media-category">
                                        {p.category}
                                      </div>
                                      <h3 className="all-products-media-title">
                                        <Link
                                          to={`/products/${p.id}`}
                                          className="all-products-media-title-link"
                                        >
                                          {p.title}
                                        </Link>
                                      </h3>
                                    </div>
                                    <div className="all-products-media-cart">
                                      <div className="all-products-media-prices">
                                        <div className="all-products-media-price">
                                          {formatter.format(p.price)}
                                        </div>
                                      </div>
                                      <div className="all-products-media-add">
                                        <button
                                          className="all-products-media-cart-button"
                                          onClick={() => {
                                            if (
                                              cart.find((c) => c.id === p.id)
                                            ) {
                                              const cartMapping = cart.map(
                                                (c) => {
                                                  if (c.id === p.id) {
                                                    const newQuantity =
                                                      c.quantity + 1;

                                                    return {
                                                      ...c,
                                                      quantity: newQuantity,
                                                      sum:
                                                        newQuantity *
                                                        c.unit_price,
                                                    };
                                                  } else {
                                                    return {
                                                      ...c,
                                                    };
                                                  }
                                                }
                                              );

                                              setCart(cartMapping);
                                            } else {
                                              setCart([
                                                ...cart,
                                                {
                                                  id: p.id,
                                                  title: p.title,
                                                  image: p.image,
                                                  unit_price: p.price,
                                                  quantity: 1,
                                                  sum: p.price * 1,
                                                  category: p.category,
                                                },
                                              ]);
                                            }

                                            openNotification(
                                              "success",
                                              "Success",
                                              "Add to cart success"
                                            );
                                          }}
                                        >
                                          <span className="all-products-media-cart-icon">
                                            <svg
                                              width="20"
                                              height="20"
                                              viewBox="0 0 20 20"
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="all-products-media-cart-svg"
                                            >
                                              {" "}
                                              <circle
                                                cx="7.3"
                                                cy="17.3"
                                                r="1.4"
                                              ></circle>{" "}
                                              <circle
                                                cx="13.3"
                                                cy="17.3"
                                                r="1.4"
                                              ></circle>{" "}
                                              <polyline
                                                fill="none"
                                                stroke="#fff"
                                                points="0 2 3.2 4 5.3 12.5 16 12.5 18 6.5 8 6.5"
                                              ></polyline>
                                            </svg>
                                          </span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </article>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllProducts;
