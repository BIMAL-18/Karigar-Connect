import {
    ArrowLeft,
    CheckCircle,
    Package,
    QrCode,
    RefreshCw,
    ScanLine,
    Search,
    XCircle,
} from "lucide-react";

import {
    Link,
    useSearchParams,
} from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";

import api from "../../services/api";


const DeliveryQR = () => {

    const [searchParams] =
        useSearchParams();

    const orderQuery =
        searchParams.get("order");


    // =====================================================
    // STATE
    // =====================================================

    const [assignments, setAssignments] =
        useState([]);

    const [
        selectedAssignment,
        setSelectedAssignment,
    ] = useState(null);

    const [qrImage, setQrImage] =
        useState("");

    const [qrToken, setQrToken] =
        useState("");

    const [
        verificationResult,
        setVerificationResult,
    ] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [generating, setGenerating] =
        useState(false);

    const [verifying, setVerifying] =
        useState(false);

    const [error, setError] =
        useState("");

    const [manualCode, setManualCode] =
        useState("");


    // =====================================================
    // HELPERS
    // =====================================================

    const getAssignmentId = (
        assignment
    ) => {

        if (!assignment) {
            return null;
        }

        return (
            assignment._id ||
            assignment.id ||
            null
        );
    };


    const getOrderId = (
        assignment
    ) => {

        if (!assignment) {
            return null;
        }

        const order =
            assignment.order ||
            assignment.orderId ||
            {};

        return (
            order._id ||
            order.id ||
            (
                typeof assignment.orderId ===
                "string"
                    ? assignment.orderId
                    : null
            ) ||
            null
        );
    };


    const formatStatus = (
        status
    ) => {

        if (!status) {
            return "Unknown";
        }

        return String(status)
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                (letter) =>
                    letter.toUpperCase()
            );
    };


    // =====================================================
    // EXTRACT QR DATA
    // =====================================================

    const extractQrData = (
        responseData
    ) => {

        const root =
            responseData?.data ||
            responseData;


        if (!root) {
            return {
                image: "",
                token: "",
            };
        }


        // Direct string
        if (
            typeof root ===
            "string"
        ) {

            if (
                root.startsWith(
                    "data:image"
                )
            ) {
                return {
                    image: root,
                    token: "",
                };
            }

            return {
                image: "",
                token: root,
            };
        }


        const data =
            root.data ||
            root;


        const image =
            data.qrCode ||
            data.qrImage ||
            data.image ||
            data.imageData ||
            "";


        const token =
            data.token ||
            data.qrToken ||
            data.verificationToken ||
            data.deliveryQrToken ||
            data.code ||
            "";


        return {

            image:
                typeof image ===
                    "string" &&
                image.startsWith(
                    "data:image"
                )
                    ? image
                    : "",

            token:
                typeof token ===
                    "string"
                    ? token
                    : "",
        };
    };


    // =====================================================
    // LOAD ASSIGNMENTS
    // =====================================================

    const loadAssignments =
        async () => {

            try {

                setError("");

                const response =
                    await api.get(
                        "/delivery-assignments/my-deliveries"
                    );


                const data =
                    response.data
                        ?.assignments ||
                    response.data
                        ?.data ||
                    response.data ||
                    [];


                const list =
                    Array.isArray(data)
                        ? data
                        : [];


                setAssignments(list);


                let selected =
                    null;


                if (orderQuery) {

                    selected =
                        list.find(
                            (
                                assignment
                            ) => {

                                const currentOrderId =
                                    getOrderId(
                                        assignment
                                    );

                                return (
                                    String(
                                        currentOrderId
                                    ) ===
                                    String(
                                        orderQuery
                                    )
                                );
                            }
                        );
                }


                if (
                    !selected &&
                    list.length > 0
                ) {
                    selected =
                        list[0];
                }


                if (selected) {

                    setSelectedAssignment(
                        selected
                    );

                    await loadExistingQR(
                        selected
                    );
                }

            } catch (err) {

                console.error(
                    "Failed to load delivery assignments:",
                    err
                );


                setError(
                    err.response?.data
                        ?.message ||
                    "Failed to load delivery assignments."
                );

            } finally {

                setLoading(false);

                setRefreshing(false);
            }
        };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadAssignments();

    }, [orderQuery]);


    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh =
        async () => {

            setRefreshing(true);

            await loadAssignments();
        };


    // =====================================================
    // SELECT ASSIGNMENT
    // =====================================================

    const selectAssignment =
        async (
            assignment
        ) => {

            setSelectedAssignment(
                assignment
            );

            setQrImage("");

            setQrToken("");

            setManualCode("");

            setVerificationResult(
                null
            );

            setError("");

            await loadExistingQR(
                assignment
            );
        };


    // =====================================================
    // LOAD EXISTING QR
    // =====================================================

    const loadExistingQR =
        async (
            assignment
        ) => {

            const assignmentId =
                getAssignmentId(
                    assignment
                );


            if (!assignmentId) {
                return;
            }


            try {

                const response =
                    await api.get(
                        `/delivery-qr/${assignmentId}`
                    );


                const {
                    image,
                    token,
                } =
                    extractQrData(
                        response.data
                    );


                if (image) {
                    setQrImage(image);
                }


                if (token) {
                    setQrToken(token);
                }

            } catch (err) {

                if (
                    err.response
                        ?.status !==
                    404
                ) {

                    console.error(
                        "Failed to load existing QR:",
                        err
                    );
                }
            }
        };


    // =====================================================
    // GENERATE QR
    // =====================================================

    const generateQR =
        async () => {

            if (!selectedAssignment) {

                setError(
                    "Please select a delivery first."
                );

                return;
            }


            const assignmentId =
                getAssignmentId(
                    selectedAssignment
                );


            if (!assignmentId) {

                setError(
                    "Delivery assignment ID is missing."
                );

                return;
            }


            try {

                setGenerating(true);

                setError("");

                setQrImage("");

                setQrToken("");

                setVerificationResult(
                    null
                );


                const response =
                    await api.post(
                        `/delivery-qr/${assignmentId}/generate`
                    );


                console.log(
                    "QR generate response:",
                    response.data
                );


                const {
                    image,
                    token,
                } =
                    extractQrData(
                        response.data
                    );


                if (!image) {

                    setError(
                        "Backend did not return a QR image."
                    );

                    return;
                }


                if (!token) {

                    setError(
                        "Backend did not return the verification token."
                    );

                    return;
                }


                setQrImage(image);

                setQrToken(token);

            } catch (err) {

                console.error(
                    "Failed to generate QR:",
                    err
                );


                setError(
                    err.response?.data
                        ?.message ||
                    "Unable to generate QR code."
                );

            } finally {

                setGenerating(false);
            }
        };


    // =====================================================
    // VERIFY QR
    // =====================================================

    const verifyQR =
        async (
            code = manualCode
        ) => {

            const cleanCode =
                String(
                    code || ""
                ).trim();


            if (!cleanCode) {

                setError(
                    "Please enter a QR verification token."
                );

                return;
            }


            if (!selectedAssignment) {

                setError(
                    "Please select a delivery first."
                );

                return;
            }


            const assignmentId =
                getAssignmentId(
                    selectedAssignment
                );


            if (!assignmentId) {

                setError(
                    "Delivery assignment ID is missing."
                );

                return;
            }


            try {

                setVerifying(true);

                setError("");

                setVerificationResult(
                    null
                );


                const response =
                    await api.post(
                        `/delivery-qr/${assignmentId}/verify`,
                        {
                            token:
                                cleanCode,
                        }
                    );


                console.log(
                    "QR verification response:",
                    response.data
                );


                setVerificationResult({

                    success: true,

                    message:
                        response.data
                            ?.message ||
                        "QR verification successful.",

                    data:
                        response.data
                            ?.data ||
                        response.data,
                });


                setManualCode("");


                // Update selected assignment
                setSelectedAssignment(
                    (previous) => {

                        if (!previous) {
                            return previous;
                        }


                        return {
                            ...previous,

                            status:
                                "DELIVERED",

                            qrVerified:
                                true,
                        };
                    }
                );


                // Update assignment list
                setAssignments(
                    (previous) =>
                        previous.map(
                            (
                                assignment
                            ) => {

                                const currentId =
                                    getAssignmentId(
                                        assignment
                                    );


                                if (
                                    String(
                                        currentId
                                    ) !==
                                    String(
                                        assignmentId
                                    )
                                ) {
                                    return assignment;
                                }


                                return {
                                    ...assignment,

                                    status:
                                        "DELIVERED",

                                    qrVerified:
                                        true,
                                };
                            }
                        )
                );

            } catch (err) {

                console.error(
                    "QR verification failed:",
                    err
                );


                setVerificationResult({

                    success: false,

                    message:
                        err.response?.data
                            ?.message ||
                        "QR verification failed.",
                });

            } finally {

                setVerifying(false);
            }
        };


    // =====================================================
    // SELECTED ORDER
    // =====================================================

    const selectedOrder =
        selectedAssignment?.order ||
        selectedAssignment?.orderId ||
        {};


    const selectedOrderId =
        getOrderId(
            selectedAssignment
        );


    const selectedStatus =
        selectedAssignment?.status ||
        selectedOrder?.status ||
        "ASSIGNED";


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="min-h-screen bg-gray-50">

                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

                    <div className="animate-pulse space-y-6">

                        <div className="h-10 w-72 rounded bg-gray-200" />

                        <div className="grid gap-6 lg:grid-cols-3">

                            <div className="h-[500px] rounded-2xl bg-gray-200" />

                            <div className="h-[500px] rounded-2xl bg-gray-200 lg:col-span-2" />

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="min-h-screen bg-gray-50">

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

                {/* HEADER */}

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div>

                        <Link
                            to="/delivery"
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
                        >

                            <ArrowLeft
                                size={17}
                            />

                            Back to Dashboard

                        </Link>


                        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
                            Delivery Panel
                        </p>


                        <h1 className="mt-1 text-3xl font-black sm:text-4xl">
                            QR Verification
                        </h1>


                        <p className="mt-2 text-gray-500">
                            Generate and verify delivery QR codes.
                        </p>

                    </div>


                    <button
                        onClick={
                            handleRefresh
                        }
                        disabled={
                            refreshing
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                    >

                        <RefreshCw
                            size={18}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}

                    </button>

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

                                <p className="mt-1 break-words text-sm text-red-600">
                                    {error}
                                </p>

                            </div>

                        </div>

                    </div>
                )}


                {/* NO DELIVERIES */}

                {assignments.length === 0 ? (

                    <div className="mt-8 rounded-2xl border bg-white p-12 text-center">

                        <QrCode
                            size={55}
                            className="mx-auto text-gray-300"
                        />

                        <h2 className="mt-5 text-2xl font-black">
                            No Deliveries
                        </h2>

                        <p className="mt-2 text-gray-500">
                            You don't have any delivery assignments to verify.
                        </p>

                        <Link
                            to="/delivery"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white"
                        >

                            <ArrowLeft
                                size={17}
                            />

                            Back to Dashboard

                        </Link>

                    </div>

                ) : (

                    <div className="mt-8 grid gap-6 lg:grid-cols-3">

                        {/* DELIVERY LIST */}

                        <div className="rounded-2xl border bg-white p-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">

                                    <Package
                                        size={21}
                                    />

                                </div>

                                <div>

                                    <h2 className="font-black">
                                        My Deliveries
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Select an order
                                    </p>

                                </div>

                            </div>


                            <div className="mt-5 space-y-3">

                                {assignments.map(
                                    (
                                        assignment,
                                        index
                                    ) => {

                                        const order =
                                            assignment.order ||
                                            assignment.orderId ||
                                            {};


                                        const id =
                                            assignment._id ||
                                            assignment.id ||
                                            index;


                                        const orderId =
                                            order._id ||
                                            order.id ||
                                            assignment.orderId;


                                        const status =
                                            assignment.status ||
                                            order.status ||
                                            "ASSIGNED";


                                        const selected =
                                            selectedAssignment ===
                                            assignment;


                                        return (

                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() =>
                                                    selectAssignment(
                                                        assignment
                                                    )
                                                }
                                                className={`w-full rounded-xl border p-4 text-left transition ${
                                                    selected
                                                        ? "border-black bg-gray-50"
                                                        : "hover:bg-gray-50"
                                                }`}
                                            >

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">

                                                        <Package
                                                            size={18}
                                                        />

                                                    </div>


                                                    <div className="min-w-0 flex-1">

                                                        <p className="truncate font-black">

                                                            #

                                                            {String(
                                                                orderId ||
                                                                "N/A"
                                                            ).slice(-10)}

                                                        </p>


                                                        <p className="mt-1 text-xs text-gray-500">

                                                            {formatStatus(
                                                                status
                                                            )}

                                                        </p>

                                                    </div>

                                                </div>

                                            </button>
                                        );
                                    }
                                )}

                            </div>

                        </div>


                        {/* QR PANEL */}

                        <div className="lg:col-span-2">

                            {!selectedAssignment ? (

                                <div className="flex min-h-[500px] items-center justify-center rounded-2xl border bg-white">

                                    <div className="text-center">

                                        <QrCode
                                            size={55}
                                            className="mx-auto text-gray-300"
                                        />

                                        <h2 className="mt-5 text-xl font-black">
                                            Select an Order
                                        </h2>

                                        <p className="mt-2 text-gray-500">
                                            Select a delivery from the list.
                                        </p>

                                    </div>

                                </div>

                            ) : (

                                <div className="space-y-6">

                                    {/* ORDER INFO */}

                                    <div className="rounded-2xl border bg-white p-6">

                                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                                            <div>

                                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                                    Selected Order
                                                </p>

                                                <h2 className="mt-1 text-2xl font-black">

                                                    #

                                                    {String(
                                                        selectedOrderId ||
                                                        "N/A"
                                                    ).slice(-10)}

                                                </h2>

                                            </div>


                                            <span className="w-fit rounded-full bg-gray-100 px-4 py-2 text-sm font-bold">

                                                {formatStatus(
                                                    selectedStatus
                                                )}

                                            </span>

                                        </div>

                                    </div>


                                    {/* GENERATE QR */}

                                    <div className="rounded-2xl border bg-white p-6">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">

                                                <QrCode
                                                    size={22}
                                                />

                                            </div>


                                            <div>

                                                <h2 className="text-xl font-black">
                                                    Generate QR
                                                </h2>

                                                <p className="text-sm text-gray-500">
                                                    Generate a verification QR code for this delivery.
                                                </p>

                                            </div>

                                        </div>


                                        <button
                                            onClick={
                                                generateQR
                                            }
                                            disabled={
                                                generating ||
                                                selectedStatus ===
                                                    "DELIVERED"
                                            }
                                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                                        >

                                            <QrCode
                                                size={18}
                                            />

                                            {generating
                                                ? "Generating..."
                                                : selectedStatus ===
                                                    "DELIVERED"
                                                    ? "Delivery Completed"
                                                    : "Generate QR Code"}

                                        </button>


                                        {/* QR IMAGE */}

                                        {qrImage && (

                                            <div className="mt-6 rounded-2xl border bg-gray-50 p-6">

                                                <p className="text-center text-xs font-bold uppercase tracking-wide text-gray-400">
                                                    Delivery QR Code
                                                </p>


                                                <div className="mt-4 flex justify-center">

                                                    <div className="rounded-2xl border bg-white p-4 shadow-sm">

                                                        <img
                                                            src={
                                                                qrImage
                                                            }
                                                            alt="Delivery QR Code"
                                                            className="h-64 w-64 object-contain"
                                                        />

                                                    </div>

                                                </div>


                                                <p className="mt-4 text-center text-xs text-gray-500">
                                                    Scan this QR code to read the delivery verification data.
                                                </p>

                                            </div>
                                        )}


                                        {/* TOKEN */}

                                        {qrToken && (

                                            <div className="mt-6 rounded-xl border bg-gray-50 p-5">

                                                <div className="flex items-center justify-between gap-3">

                                                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                                                        Verification Token
                                                    </p>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setManualCode(
                                                                qrToken
                                                            )
                                                        }
                                                        className="rounded-lg bg-black px-3 py-2 text-xs font-bold text-white hover:bg-gray-800"
                                                    >
                                                        Use Token
                                                    </button>

                                                </div>


                                                <div className="mt-3 break-all rounded-lg bg-white p-4 font-mono text-sm">
                                                    {qrToken}
                                                </div>

                                            </div>
                                        )}

                                    </div>


                                    {/* VERIFY */}

                                    <div className="rounded-2xl border bg-white p-6">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">

                                                <ScanLine
                                                    size={22}
                                                />

                                            </div>


                                            <div>

                                                <h2 className="text-xl font-black">
                                                    Verify QR
                                                </h2>

                                                <p className="text-sm text-gray-500">
                                                    Enter the QR verification token.
                                                </p>

                                            </div>

                                        </div>


                                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                                            <div className="relative flex-1">

                                                <Search
                                                    size={18}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                                />


                                                <input
                                                    type="text"
                                                    value={
                                                        manualCode
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setManualCode(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    onKeyDown={(
                                                        event
                                                    ) => {

                                                        if (
                                                            event.key ===
                                                            "Enter"
                                                        ) {
                                                            verifyQR();
                                                        }

                                                    }}
                                                    placeholder="Enter QR verification token"
                                                    className="w-full rounded-xl border px-11 py-3 outline-none focus:border-black"
                                                />

                                            </div>


                                            <button
                                                onClick={() =>
                                                    verifyQR()
                                                }
                                                disabled={
                                                    verifying ||
                                                    selectedStatus ===
                                                        "DELIVERED"
                                                }
                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                                            >

                                                {verifying
                                                    ? "Verifying..."
                                                    : selectedStatus ===
                                                        "DELIVERED"
                                                        ? "Already Delivered"
                                                        : "Verify"}

                                            </button>

                                        </div>


                                        {/* RESULT */}

                                        {verificationResult && (

                                            <div
                                                className={`mt-6 rounded-xl border p-5 ${
                                                    verificationResult.success
                                                        ? "border-green-200 bg-green-50"
                                                        : "border-red-200 bg-red-50"
                                                }`}
                                            >

                                                <div className="flex items-start gap-3">

                                                    {verificationResult.success ? (

                                                        <CheckCircle
                                                            size={23}
                                                            className="shrink-0 text-green-600"
                                                        />

                                                    ) : (

                                                        <XCircle
                                                            size={23}
                                                            className="shrink-0 text-red-600"
                                                        />

                                                    )}


                                                    <div>

                                                        <p
                                                            className={`font-bold ${
                                                                verificationResult.success
                                                                    ? "text-green-700"
                                                                    : "text-red-700"
                                                            }`}
                                                        >

                                                            {verificationResult.success
                                                                ? "Verification Successful"
                                                                : "Verification Failed"}

                                                        </p>


                                                        <p
                                                            className={`mt-1 text-sm ${
                                                                verificationResult.success
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                            }`}
                                                        >

                                                            {
                                                                verificationResult.message
                                                            }

                                                        </p>


                                                        {verificationResult.success && (

                                                            <p className="mt-2 text-xs font-medium text-green-700">

                                                                Delivery has been completed successfully.

                                                            </p>

                                                        )}

                                                    </div>

                                                </div>

                                            </div>
                                        )}

                                    </div>


                                    {/* INSTRUCTIONS */}

                                    <div className="rounded-2xl border bg-white p-6">

                                        <h2 className="text-lg font-black">
                                            Delivery Verification
                                        </h2>


                                        <div className="mt-5 space-y-4">

                                            <div className="flex gap-3">

                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-black">
                                                    1
                                                </div>

                                                <p className="text-sm text-gray-600">
                                                    Select the delivery order you want to complete.
                                                </p>

                                            </div>


                                            <div className="flex gap-3">

                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-black">
                                                    2
                                                </div>

                                                <p className="text-sm text-gray-600">
                                                    Generate the delivery QR code.
                                                </p>

                                            </div>


                                            <div className="flex gap-3">

                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-black">
                                                    3
                                                </div>

                                                <p className="text-sm text-gray-600">
                                                    Use the verification token from the generated QR.
                                                </p>

                                            </div>


                                            <div className="flex gap-3">

                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-black">
                                                    4
                                                </div>

                                                <p className="text-sm text-gray-600">
                                                    Verify the token. Successful verification completes the delivery.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            )}

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
};


export default DeliveryQR;