import { IoChevronDown } from "react-icons/io5";

const Filters = ({ filters, setFilters }) => {
  const selectClasses =
    "border px-4 py-2.5 pr-10 rounded-full text-sm appearance-none w-full";

  return (
    <div
      className="
        w-full 
        flex flex-col gap-4 
        md:flex-row md:flex-wrap md:items-center
      "
    >
      {/* Each filter box should have fixed desktop width */}
      <div className="relative w-full md:w-1/5">
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          className={selectClasses}
        >
          <option value="">Sort By</option>
          <option value="name-asc">Name (A → Z)</option>
          <option value="name-desc">Name (Z → A)</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <IoChevronDown className="absolute right-4 top-1/2 -translate-y-1/2" />
      </div>

      <div className="relative w-full md:w-1/5">
        <select
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className={selectClasses}
        >
          <option value="">Product Name</option>
          <option value="crema-marfil">Crema Marfil</option>
          <option value="black-galaxy">Black Galaxy</option>
          <option value="statuario">Statuario</option>
        </select>
        <IoChevronDown className="absolute right-4 top-1/2 -translate-y-1/2" />
      </div>

      <div className="relative w-full md:w-1/5">
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className={selectClasses}
        >
          <option value="">Type</option>
          <option value="marble">Marble</option>
          <option value="granite">Granite</option>
          <option value="onyx">Onyx</option>
          <option value="travertine">Travertine</option>
        </select>
        <IoChevronDown className="absolute right-4 top-1/2 -translate-y-1/2" />
      </div>

      <div className="relative w-full md:w-1/5">
        <select
          value={filters.color}
          onChange={(e) => setFilters({ ...filters, color: e.target.value })}
          className={selectClasses}
        >
          <option value="">Color</option>
          <option value="white">White</option>
          <option value="beige">Beige</option>
          <option value="black">Black</option>
          <option value="brown">Brown</option>
          <option value="gold">Gold</option>
        </select>
        <IoChevronDown className="absolute right-4 top-1/2 -translate-y-1/2" />
      </div>

      <div className="relative w-full md:w-1/5">
        <select
          value={filters.origin}
          onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
          className={selectClasses}
        >
          <option value="">Origin</option>
          <option value="india">India</option>
          <option value="brazil">Brazil</option>
          <option value="italy">Italy</option>
          <option value="turkey">Turkey</option>
        </select>
        <IoChevronDown className="absolute right-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* RESET BUTTON — Same pill shape */}
      <button
        onClick={() =>
          setFilters({
            sort: "",
            name: "",
            type: "",
            color: "",
            origin: "",
            status: "",
          })
        }
        className="
          w-full md:w-1/5 
          px-4 py-2.5 
          rounded-full border text-sm 
          transition cursor-pointer text-center
        "
      >
        Reset
      </button>
    </div>
  );
};

export default Filters;
