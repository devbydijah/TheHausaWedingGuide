import { useState, useMemo, useRef, useEffect } from "react";
import {
  Storefront,
  Plus,
  FunnelSimple,
  X,
  PencilSimple,
  Trash,
  Phone,
  EnvelopeSimple,
  MapPin,
  CurrencyDollar,
  SortAscending,
  CheckCircle,
  Clock,
  ChatCircleDots,
  FileText,
  Wallet,
  Handshake,
} from "@phosphor-icons/react";
import { Card } from "../../components/ui";
import { VENDOR_CATEGORIES, VENDOR_STATUS } from "../../lib/constants";

/**
 * VendorTracker Component
 *
 * Comprehensive vendor management with filtering, status tracking, and budget monitoring
 */
export default function VendorTracker({
  data,
  addVendor,
  updateVendor,
  deleteVendor,
  setActiveSection,
  darkMode,
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("category");
  const [showFilters, setShowFilters] = useState(false);

  const modalRef = useRef(null);
  const nameInputRef = useRef(null);

  const vendors = data?.vendorList || [];

  // Focus name input when modal opens
  useEffect(() => {
    if (showModal && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showModal]);

  // Trap focus within modal when open
  useEffect(() => {
    if (!showModal) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
        setEditingVendor(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  // Get status display info with icons
  const getStatusInfo = (status) => {
    const config = {
      Researching: {
        label: "Researching",
        color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
        icon: <Clock size={16} weight="bold" />,
        iconEmoji: "🔍",
      },
      Contacted: {
        label: "Contacted",
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        icon: <ChatCircleDots size={16} weight="bold" />,
        iconEmoji: "📧",
      },
      "Quote Received": {
        label: "Quote Received",
        color:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        icon: <FileText size={16} weight="bold" />,
        iconEmoji: "📄",
      },
      Booked: {
        label: "Booked",
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        icon: <CheckCircle size={16} weight="fill" />,
        iconEmoji: "✅",
      },
      "Deposit Paid": {
        label: "Deposit Paid",
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        icon: <Wallet size={16} weight="bold" />,
        iconEmoji: "💰",
      },
      Confirmed: {
        label: "Confirmed",
        color:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        icon: <Handshake size={16} weight="bold" />,
        iconEmoji: "🤝",
      },
    };
    return config[status] || config.Researching;
  };

  // Filter and sort vendors with memoization
  const filteredVendors = useMemo(() => {
    let filtered = vendors.filter((vendor) => {
      // Category filter
      if (filterCategory !== "all" && vendor.category !== filterCategory)
        return false;

      // Status filter
      if (filterStatus !== "all" && vendor.status !== filterStatus)
        return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = vendor.name?.toLowerCase().includes(query);
        const matchesContact = vendor.contact?.toLowerCase().includes(query);
        const matchesNotes = vendor.notes?.toLowerCase().includes(query);
        if (!matchesName && !matchesContact && !matchesNotes) return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "category":
          return (a.category || "").localeCompare(b.category || "");

        case "status": {
          const statusOrder = {
            Researching: 0,
            Contacted: 1,
            "Quote Received": 2,
            Booked: 3,
            "Deposit Paid": 4,
            Confirmed: 5,
          };
          return statusOrder[a.status] - statusOrder[b.status];
        }

        case "name":
          return (a.name || "").localeCompare(b.name || "");

        case "price":
          return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);

        default:
          return 0;
      }
    });

    return filtered;
  }, [vendors, filterCategory, filterStatus, searchQuery, sortBy]);

  // Calculate vendor statistics
  const vendorStats = useMemo(() => {
    const total = vendors.length;
    const booked = vendors.filter(
      (v) =>
        v.status === "Booked" ||
        v.status === "Deposit Paid" ||
        v.status === "Confirmed"
    ).length;
    const researching = vendors.filter(
      (v) => v.status === "Researching"
    ).length;
    const totalCost = vendors.reduce(
      (sum, v) => sum + (parseFloat(v.price) || 0),
      0
    );
    const depositsPaid = vendors.filter(
      (v) => v.status === "Deposit Paid" || v.status === "Confirmed"
    ).length;
    const progressPercent = total > 0 ? Math.round((booked / total) * 100) : 0;

    return {
      total,
      booked,
      researching,
      totalCost,
      depositsPaid,
      progressPercent,
    };
  }, [vendors]);

  // Handle save vendor (add or update)
  const handleSaveVendor = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const vendorData = {
      name: formData.get("name"),
      category: formData.get("category"),
      contact: formData.get("contact") || "",
      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      website: formData.get("website") || "",
      price: formData.get("price") || "",
      status: formData.get("status"),
      notes: formData.get("notes") || "",
    };

    if (editingVendor) {
      updateVendor(editingVendor.id, vendorData);
    } else {
      addVendor({
        ...vendorData,
        id: `vendor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      });
    }

    setShowModal(false);
    setEditingVendor(null);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterCategory("all");
    setFilterStatus("all");
    setSearchQuery("");
  };

  const hasActiveFilters =
    filterCategory !== "all" ||
    filterStatus !== "all" ||
    searchQuery.trim() !== "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#CE805C] to-[#B87050] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 text-center">
          <div className="text-6xl sm:text-7xl mb-4" aria-hidden="true">
            🏪
          </div>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold mb-3">
            Vendor Tracker
          </h1>
          <p className="font-inter text-lg opacity-90">
            Manage your wedding service providers
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="!p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-playfair text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#740015] to-[#531946] bg-clip-text text-transparent">
            Vendor Progress
          </h2>
          <span className="font-inter text-2xl sm:text-3xl font-bold text-[#CE805C] dark:text-[#CE805C]">
            {vendorStats.progressPercent}%
          </span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#CE805C] to-[#B87050] transition-all duration-500 rounded-full"
            style={{ width: `${vendorStats.progressPercent}%` }}
            role="progressbar"
            aria-valuenow={vendorStats.progressPercent}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {vendorStats.total}
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Vendors
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {vendorStats.booked}
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Booked
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {vendorStats.researching}
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Researching
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#CE805C]">
              ₦{vendorStats.totalCost.toLocaleString()}
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Budget
            </div>
          </div>
        </div>
      </Card>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => {
            setEditingVendor(null);
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#CE805C] to-[#B87050] text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#CE805C]/50"
        >
          <Plus size={20} weight="bold" />
          Add Vendor
        </button>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold border-2 transition-all focus:outline-none focus:ring-4 focus:ring-[#CE805C]/50 ${
            showFilters || hasActiveFilters
              ? "border-[#CE805C] bg-[#CE805C]/10 text-[#CE805C]"
              : darkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <FunnelSimple size={20} weight="bold" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-[#CE805C] text-white text-xs rounded-full">
              {[
                filterCategory !== "all" ? 1 : 0,
                filterStatus !== "all" ? 1 : 0,
                searchQuery.trim() ? 1 : 0,
              ].reduce((a, b) => a + b, 0)}
            </span>
          )}
        </button>

        <div className="flex-1" />

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search vendors..."
          className={`px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
          aria-label="Search vendors by name, contact, or notes"
        />
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="!p-4">
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Filter Vendors
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-[#CE805C] hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-[#CE805C] rounded px-2 py-1"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label
                htmlFor="filter-category"
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Category
              </label>
              <select
                id="filter-category"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="all">All Categories</option>
                {VENDOR_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label
                htmlFor="filter-status"
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Status
              </label>
              <select
                id="filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="all">All Statuses</option>
                {VENDOR_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Sort Controls */}
      {filteredVendors.length > 0 && (
        <div className="flex items-center gap-2">
          <SortAscending
            size={20}
            className={darkMode ? "text-gray-400" : "text-gray-600"}
          />
          <span
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            aria-label="Sort vendors"
          >
            <option value="category">Category</option>
            <option value="status">Status</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </div>
      )}

      {/* Vendor Grid */}
      {filteredVendors.length === 0 ? (
        <Card className="!p-12 text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h3
            className={`font-playfair text-2xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {hasActiveFilters
              ? "No vendors match your filters"
              : "No vendors yet"}
          </h3>
          <p
            className={`font-inter mb-6 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {hasActiveFilters
              ? "Try adjusting your filters or search query"
              : "Add your first vendor to start tracking"}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-gradient-to-r from-[#CE805C] to-[#B87050] text-white rounded-lg font-semibold hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#CE805C]/50"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingVendor(null);
                setShowModal(true);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#CE805C] to-[#B87050] text-white rounded-lg font-semibold hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#CE805C]/50"
            >
              Add Your First Vendor
            </button>
          )}
        </Card>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          role="list"
        >
          {filteredVendors.map((vendor) => {
            const statusInfo = getStatusInfo(vendor.status);

            return (
              <article
                key={vendor.id}
                className={`${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } border-2 rounded-xl p-5 transition-all hover:shadow-lg hover:border-[#CE805C]/50`}
                role="listitem"
              >
                {/* Vendor Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-playfair text-xl font-bold mb-1 truncate ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {vendor.name}
                    </h3>
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg text-sm font-medium ${
                        darkMode
                          ? "bg-[#CE805C]/20 text-[#CE805C]"
                          : "bg-[#CE805C]/10 text-[#740015]"
                      }`}
                    >
                      {vendor.category}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingVendor(vendor);
                        setShowModal(true);
                      }}
                      className={`p-2 rounded-lg transition-colors hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                        darkMode
                          ? "hover:bg-gray-700 text-gray-400"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                      aria-label={`Edit ${vendor.name}`}
                    >
                      <PencilSimple size={18} weight="bold" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete ${vendor.name}?`
                          )
                        ) {
                          deleteVendor(vendor.id);
                        }
                      }}
                      className="p-2 rounded-lg transition-colors hover:scale-110 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Delete ${vendor.name}`}
                    >
                      <Trash size={18} weight="bold" />
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-3">
                  {vendor.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone
                        size={16}
                        weight="bold"
                        className="flex-shrink-0 text-[#CE805C]"
                        aria-hidden="true"
                      />
                      <a
                        href={`tel:${vendor.phone}`}
                        className={`hover:underline truncate ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {vendor.phone}
                      </a>
                    </div>
                  )}
                  {vendor.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <EnvelopeSimple
                        size={16}
                        weight="bold"
                        className="flex-shrink-0 text-[#CE805C]"
                        aria-hidden="true"
                      />
                      <a
                        href={`mailto:${vendor.email}`}
                        className={`hover:underline truncate ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {vendor.email}
                      </a>
                    </div>
                  )}
                  {vendor.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin
                        size={16}
                        weight="bold"
                        className="flex-shrink-0 text-[#CE805C]"
                        aria-hidden="true"
                      />
                      <a
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`hover:underline truncate ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>

                {/* Price */}
                {vendor.price && (
                  <div className="flex items-center gap-2 mb-3">
                    <CurrencyDollar
                      size={20}
                      weight="bold"
                      className="text-green-600 dark:text-green-400"
                      aria-hidden="true"
                    />
                    <span
                      className={`font-semibold text-lg ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ₦{parseFloat(vendor.price).toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm ${statusInfo.color}`}
                  >
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                </div>

                {/* Notes */}
                {vendor.notes && (
                  <p
                    className={`text-sm leading-relaxed line-clamp-2 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                    title={vendor.notes}
                  >
                    {vendor.notes}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Vendor Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="vendor-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setEditingVendor(null);
            }
          }}
        >
          <div
            ref={modalRef}
            className={`w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h2
                id="vendor-modal-title"
                className={`font-playfair text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {editingVendor ? "Edit Vendor" : "Add New Vendor"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingVendor(null);
                }}
                className={`p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
                aria-label="Close modal"
              >
                <X size={24} weight="bold" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveVendor} className="p-6 space-y-5">
              {/* Vendor Name */}
              <div>
                <label
                  htmlFor="vendor-name"
                  className={`block text-sm font-semibold mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Vendor Name *
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  id="vendor-name"
                  name="name"
                  defaultValue={editingVendor?.name || ""}
                  required
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="e.g., Elegant Events Photography"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Category */}
                <div>
                  <label
                    htmlFor="vendor-category"
                    className={`block text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Category *
                  </label>
                  <select
                    id="vendor-category"
                    name="category"
                    defaultValue={
                      editingVendor?.category || VENDOR_CATEGORIES[0]
                    }
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    {VENDOR_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="vendor-status"
                    className={`block text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Status *
                  </label>
                  <select
                    id="vendor-status"
                    name="status"
                    defaultValue={editingVendor?.status || "Researching"}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    {VENDOR_STATUS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="vendor-phone"
                    className={`block text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="vendor-phone"
                    name="phone"
                    defaultValue={editingVendor?.phone || ""}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="e.g., +234 800 123 4567"
                  />
                </div>

                <div>
                  <label
                    htmlFor="vendor-email"
                    className={`block text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="vendor-email"
                    name="email"
                    defaultValue={editingVendor?.email || ""}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="e.g., info@vendor.com"
                  />
                </div>
              </div>

              {/* Website & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="vendor-website"
                    className={`block text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Website
                  </label>
                  <input
                    type="url"
                    id="vendor-website"
                    name="website"
                    defaultValue={editingVendor?.website || ""}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="e.g., https://vendor.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="vendor-price"
                    className={`block text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    id="vendor-price"
                    name="price"
                    defaultValue={editingVendor?.price || ""}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="e.g., 250000"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="vendor-notes"
                  className={`block text-sm font-semibold mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Notes (optional)
                </label>
                <textarea
                  id="vendor-notes"
                  name="notes"
                  defaultValue={editingVendor?.notes || ""}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE805C] resize-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="Add any additional details, contract terms, or reminders..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingVendor(null);
                  }}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold border-2 transition-all focus:outline-none focus:ring-4 focus:ring-gray-500/50 ${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#CE805C] to-[#B87050] text-white rounded-lg font-semibold hover:shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-[#CE805C]/50"
                >
                  {editingVendor ? "Save Changes" : "Add Vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
