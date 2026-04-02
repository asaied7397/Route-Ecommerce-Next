import { Truck, Shield, Headphones } from "lucide-react";
import { FaArrowRotateLeft } from "react-icons/fa6";

const features = [
  { icon: Truck, title: "Free Delivery", desc: "On orders over 500 EGP" },
  {
    icon: FaArrowRotateLeft,
    title: "Easy Returns",
    desc: "14-day return policy",
  },
  { icon: Shield, title: "Secure Payment", desc: "100% secure checkout" },
  { icon: Headphones, title: "24/7 Support", desc: "Contact us anytime" },
];

export default function Features() {
  return (
    <div className={"bg-green-50 border-y border-green-100"}>
      <div className="container mx-auto px-4 py-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#0aad0a]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
                <p className="text-gray-500 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
