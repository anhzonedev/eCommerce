import mongoose from "mongoose";
import slugify from "slugify";

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },

    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },

    images: [{ type: String }],

    attributes: [
      {
        name: { type: String, required: true },
        values: [{ type: String, required: true }],
      },
    ],

    variations: [
      {
        sku: { type: String },
        options: { type: Map, of: String, required: true },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, default: 0, min: 0 },
      },
    ],
  },
  { timestamps: true }
);

productSchema.pre("validate", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, locale: "vi", strict: true });
  }
  next();
});

productSchema.pre("save", function (next) {
  if (this.variations && this.slug) {
    this.variations.forEach((variant, idx) => {
      if (!variant.sku) {
        const optionParts = Array.from(variant.options.values()).map((val) =>
          slugify(val, { lower: true, strict: true })
        );
        let baseSku = [this.slug, ...optionParts].join("-");
        variant.sku = `${baseSku}-${idx + 1}`;
      }
    });
  }
  next();
});

productSchema.index({ "variations.sku": 1 }, { unique: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
