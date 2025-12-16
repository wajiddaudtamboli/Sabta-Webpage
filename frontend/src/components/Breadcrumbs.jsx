import { Link } from "react-router-dom";
const Breadcrumbs = ({ items=[] }) => {
  return (
    <nav className="text-sm mb-3">
      {items.map((it,i)=>(
        <span key={i}>
          {it.to ? <Link to={it.to} className="hover:underline">{it.label}</Link> : <span>{it.label}</span>}
          {i < items.length-1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </nav>
  );
};
export default Breadcrumbs;
