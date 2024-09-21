import { useEffect, useState } from "react";
import { detail } from "../api/requests";

export default function DetailModal({ id, fileName }) {
    const [compressionInfo, setCompressionInfo] = useState();

    useEffect(() => {
        if (fileName) {
            detail(fileName).then(data => {
                setCompressionInfo(data)
            }).catch(err => {
                alert(err.message)
            })
        }
    }, [fileName]);

    return (
        <dialog id={id} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Detail of the compression</h3>
                {compressionInfo ?
                    (Object.entries(compressionInfo).map(([key,value], index) => (
                        <p key={index}>{key}: {value}</p>
                    )))
                    :
                    <p>No Detail yet</p>
                }
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}