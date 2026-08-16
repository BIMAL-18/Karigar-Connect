import {
    ArrowLeft,
    Building2,
    CheckCircle,
    Edit3,
    Loader2,
    MapPin,
    Phone,
    Save,
    User,
    XCircle,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";

import api from "../../services/api";

const ProducerProfile = () => {
    const [producer, setProducer] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [editing, setEditing] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        businessName: "",
        businessType: "",
        description: "",
        story: "",
        phone: "",
        province: "",
        district: "",
        municipality: "",
        ward: "",
        address: "",
        profileImage: "",
    });

    // ==========================================
    // LOAD PROFILE
    // ==========================================

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/producers/me"
            );

            const data =
                response.data?.producer ||
                response.data?.data ||
                null;

            if (!data) {
                throw new Error(
                    "Producer profile not found."
                );
            }

            setProducer(data);

            setFormData({
                businessName:
                    data.businessName || "",

                businessType:
                    data.businessType || "",

                description:
                    data.description || "",

                story:
                    data.story || "",

                phone:
                    data.phone || "",

                province:
                    data.province || "",

                district:
                    data.district || "",

                municipality:
                    data.municipality || "",

                ward:
                    data.ward || "",

                address:
                    data.address || "",

                profileImage:
                    data.profileImage || "",
            });
        } catch (err) {
            console.error(
                "Failed to load producer profile:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load producer profile."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {
        loadProfile();
    }, []);

    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);

            setError("");

            setSuccess("");

            const response =
                await api.put(
                    "/producers/me",
                    formData
                );

            const updatedProducer =
                response.data?.producer ||
                response.data?.data;

            if (updatedProducer) {
                setProducer(
                    updatedProducer
                );
            } else {
                await loadProfile();
            }

            setSuccess(
                "Producer profile updated successfully."
            );

            setEditing(false);
        } catch (err) {
            console.error(
                "Failed to update producer profile:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update producer profile."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // CANCEL EDIT
    // ==========================================

    const handleCancel = () => {
        if (!producer) {
            return;
        }

        setFormData({
            businessName:
                producer.businessName || "",

            businessType:
                producer.businessType || "",

            description:
                producer.description || "",

            story:
                producer.story || "",

            phone:
                producer.phone || "",

            province:
                producer.province || "",

            district:
                producer.district || "",

            municipality:
                producer.municipality || "",

            ward:
                producer.ward || "",

            address:
                producer.address || "",

            profileImage:
                producer.profileImage || "",
        });

        setEditing(false);

        setError("");

        setSuccess("");
    };

    // ==========================================
    // STATUS
    // ==========================================

    const getStatusStyle = (status) => {
        switch (status) {
            case "APPROVED":
                return "bg-green-100 text-green-700";

            case "REJECTED":
                return "bg-red-100 text-red-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-6xl px-4 py-10">

                    <div className="animate-pulse space-y-6">

                        <div className="h-10 w-64 rounded bg-gray-200" />

                        <div className="h-[600px] rounded-2xl bg-gray-200" />

                    </div>

                </div>
            </div>
        );
    }

    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

                {/* HEADER */}

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div>

                        <Link
                            to="/producer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
                        >
                            <ArrowLeft size={17} />

                            Back to Dashboard
                        </Link>

                        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
                            Producer Panel
                        </p>

                        <h1 className="mt-1 text-3xl font-black sm:text-4xl">
                            My Profile
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Manage your producer and business information.
                        </p>

                    </div>

                    {!editing && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditing(true);
                                setError("");
                                setSuccess("");
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
                        >
                            <Edit3 size={18} />

                            Edit Profile
                        </button>
                    )}

                </div>

                {/* ERROR */}

                {error && (
                    <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">

                        <div className="flex items-start gap-3">

                            <XCircle
                                size={22}
                                className="mt-0.5 shrink-0 text-red-600"
                            />

                            <div>

                                <p className="font-bold text-red-700">
                                    Error
                                </p>

                                <p className="mt-1 text-sm text-red-600">
                                    {error}
                                </p>

                            </div>

                        </div>

                    </div>
                )}

                {/* SUCCESS */}

                {success && (
                    <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">

                        <div className="flex items-start gap-3">

                            <CheckCircle
                                size={22}
                                className="mt-0.5 shrink-0 text-green-600"
                            />

                            <div>

                                <p className="font-bold text-green-700">
                                    Success
                                </p>

                                <p className="mt-1 text-sm text-green-600">
                                    {success}
                                </p>

                            </div>

                        </div>

                    </div>
                )}

                {producer && (
                    <div className="mt-8 grid gap-6 lg:grid-cols-3">

                        {/* =================================
                            PROFILE SUMMARY
                        ================================= */}

                        <div className="rounded-2xl border bg-white p-6">

                            <div className="flex flex-col items-center text-center">

                                {producer.profileImage ? (

                                    <img
                                        src={
                                            producer.profileImage
                                        }
                                        alt={
                                            producer.businessName
                                        }
                                        className="h-28 w-28 rounded-full object-cover ring-4 ring-gray-100"
                                    />

                                ) : (

                                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-100">

                                        <Building2
                                            size={45}
                                            className="text-gray-400"
                                        />

                                    </div>

                                )}

                                <h2 className="mt-5 text-xl font-black">
                                    {producer.businessName}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {producer.businessType}
                                </p>

                                <span
                                    className={`mt-4 rounded-full px-4 py-2 text-xs font-bold ${getStatusStyle(
                                        producer.verificationStatus
                                    )}`}
                                >
                                    {producer.verificationStatus ||
                                        "PENDING"}
                                </span>

                            </div>

                            <div className="mt-8 space-y-4 border-t pt-6">

                                <div className="flex gap-3">

                                    <Phone
                                        size={18}
                                        className="mt-0.5 text-gray-400"
                                    />

                                    <div>

                                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                                            Phone
                                        </p>

                                        <p className="mt-1 text-sm font-medium">
                                            {producer.phone ||
                                                "Not provided"}
                                        </p>

                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <MapPin
                                        size={18}
                                        className="mt-0.5 text-gray-400"
                                    />

                                    <div>

                                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                                            Location
                                        </p>

                                        <p className="mt-1 text-sm font-medium">
                                            {[
                                                producer.municipality,
                                                producer.district,
                                                producer.province,
                                            ]
                                                .filter(Boolean)
                                                .join(", ") ||
                                                "Not provided"}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* =================================
                            PROFILE FORM
                        ================================= */}

                        <div className="lg:col-span-2">

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                className="rounded-2xl border bg-white p-6"
                            >

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                                        <User size={21} />
                                    </div>

                                    <div>

                                        <h2 className="text-xl font-black">
                                            Business Information
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            Your producer profile information.
                                        </p>

                                    </div>

                                </div>

                                <div className="mt-8 grid gap-5 sm:grid-cols-2">

                                    {/* BUSINESS NAME */}

                                    <div>

                                        <label className="text-sm font-bold">
                                            Business Name
                                        </label>

                                        <input
                                            name="businessName"
                                            value={
                                                formData.businessName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={!editing}
                                            required
                                            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                                        />

                                    </div>

                                    {/* BUSINESS TYPE */}

                                    <div>

                                        <label className="text-sm font-bold">
                                            Business Type
                                        </label>

                                        <input
                                            name="businessType"
                                            value={
                                                formData.businessType
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={!editing}
                                            required
                                            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                                        />

                                    </div>

                                    {/* PHONE */}

                                    <div>

                                        <label className="text-sm font-bold">
                                            Phone
                                        </label>

                                        <input
                                            name="phone"
                                            value={
                                                formData.phone
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={!editing}
                                            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                                        />

                                    </div>

                                    {/* PROVINCE */}

                                    <div>

                                        <label className="text-sm font-bold">
                                            Province
                                        </label>

                                        <input
                                            name="province"
                                            value={
                                                formData.province
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={!editing}
                                            required
                                            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                                        />

                                    </div>

                                    {/* DISTRICT */}

                                    <div>

                                        <label className="text-sm font-bold">
                                            District
                                        </label>

                                        <input
                                            name="district"
                                            value={
                                                formData.district
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={!editing}
                                            required
                                            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                                        />

                                    </div>

                                    {/* MUNICIPALITY */}

                                    <div>

                                        <label className="text-sm font-bold">
                                            Municipality
                                        </label>

                                        <input
                                            name="municipality"
                                            value={
                                                formData.municipality
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={!editing}
                                            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                                        />

                                    </div>

                                    {/* WARD */}

                                    <div>

                                        <label className="text-sm font-bold">
                                            Ward
                                        </label>

                                        <input
                                            name="ward"
                                            value={
                                                formData.ward
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={!editing}
                                            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                                        />

                                    </div>

                                    {/* ADDRESS */}

                                    <div>

                                        <label className="text-sm font-bold">
                                            Address
                                        </label>

                                        <input
                                            name="address"
                                            value={
                                                formData.address
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={!editing}
                                            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                                        />

                                    </div>

                                </div>

                                {/* DESCRIPTION */}

                                <div className="mt-5">

                                    <label className="text-sm font-bold">
                                        Business Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={!editing}
                                        rows={4}
                                        className="mt-2 w-full resize-none rounded-xl border px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                                    />

                                </div>

                                {/* STORY */}

                                <div className="mt-5">

                                    <label className="text-sm font-bold">
                                        Business Story
                                    </label>

                                    <textarea
                                        name="story"
                                        value={
                                            formData.story
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={!editing}
                                        rows={5}
                                        className="mt-2 w-full resize-none rounded-xl border px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                                    />

                                </div>

                                {/* PROFILE IMAGE */}

                                <div className="mt-5">

                                    <label className="text-sm font-bold">
                                        Profile Image URL
                                    </label>

                                    <input
                                        name="profileImage"
                                        value={
                                            formData.profileImage
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={!editing}
                                        placeholder="https://..."
                                        className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                                    />

                                </div>

                                {/* ACTIONS */}

                                {editing && (
                                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                        <button
                                            type="button"
                                            onClick={
                                                handleCancel
                                            }
                                            disabled={
                                                saving
                                            }
                                            className="rounded-xl border px-5 py-3 font-semibold hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={
                                                saving
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                                        >

                                            {saving ? (
                                                <>
                                                    <Loader2
                                                        size={18}
                                                        className="animate-spin"
                                                    />

                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save
                                                        size={18}
                                                    />

                                                    Save Changes
                                                </>
                                            )}

                                        </button>

                                    </div>
                                )}

                            </form>

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
};

export default ProducerProfile;