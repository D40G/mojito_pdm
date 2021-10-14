import React, {Dispatch, useState, useEffect, SetStateAction} from 'react'
import {useTheme} from "@mui/material/styles";
import {Button, Stack, Typography, LinearProgress, Slide, Dialog} from '@mui/material'
import {fetchNui} from "../utils/fetchNui"
import { TransitionProps } from '@mui/material/transitions';
import DialogueBody from "./DialogueBody";

function getModalStyle() {
    return {
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
    }
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children?: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface Modal {
    name: string,
    brand: string,
    description: string,
    price: string;
    trunkspace: string,
    setOpen: Dispatch<SetStateAction<boolean>>
    performance: CarPerformance
    spawncode: string
}

const ModalBody: React.FC<Modal> = ({name, brand, description, price, trunkspace, setOpen, performance, spawncode}) => {
    const [modalStyle] = useState(getModalStyle)
    const theme = useTheme()
    const [buyEnabled, setBuyEnabled] = useState<boolean>(false)
    const [dialogueOpen, setDialogueOpen] = useState<boolean>(false)

    const handleClose = () => {
        setOpen(false)
    }
    const handleDialogueClose = () => {
        setDialogueOpen(false)
    }

    // TODO: This needs to be done better
    // I should look into using a state management library to use
    // this as a global state instead of fetching every time I render
    // the component
    useEffect(() => {
        fetchNui<boolean>("fetch:canbuy").then((data) => {
            console.log(data)
            setBuyEnabled(data)
        }).catch(() => {
            setBuyEnabled(true)
        })
    }, [])

    return (
        <>
            <div style={{
                ...modalStyle,
                position: "absolute",
                width: 600,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[7],
                padding: theme.spacing(2, 4, 3),
                color: theme.palette.mode === "dark" ? "white" : "black"
            }}>
                <h2 id="simple-modal-title">{`${brand} ${name}`}</h2>
                <h4>
                    Price: {price} <br/>
                    Trunk Space: {trunkspace}
                </h4>
                {performance &&
                <Typography>
                    Power <LinearProgress value={performance.power} variant="determinate"/>
                    Acceleration <LinearProgress value={performance.acceleration} variant="determinate"/>
                    Handling <LinearProgress value={performance.handling} variant="determinate"/>
                    Top Speed <LinearProgress value={performance.topspeed} variant="determinate"/>
                </Typography>
                }
                <p>
                    {description}
                </p>
                <Stack direction="row" spacing={2}>
                    <Button size="small" variant="outlined" color="error" onClick={handleClose}>Close</Button>
                    { buyEnabled && <Button size="small" variant="outlined" color="primary" onClick={() => setDialogueOpen(true)}>Buy</Button> }
                </Stack>
                <Dialog
                    open={dialogueOpen}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleDialogueClose}
                >
                    <DialogueBody
                        spawncode={spawncode}
                        price={price}
                        setDialogueOpen={setDialogueOpen}
                    />
                </Dialog>
            </div>
        </>
    )
}

export default ModalBody