import MirageWindowSmoke from './mirage_window_smoke.gif'
import MirageMidSmokeSetup from './mirage_midsmoke_setup.jpg';
import MirageConnectorSmoke from './mirage_connector_smoke_lineup.jpg';
import MirageConnectorCTSide from './mirage_connector_ctView.jpg';
import MirageCTSmokeSetup from './mirage_ctSmoke_setup.jpg';
import MirageTicketBoothSmoke from './mirage_ticketbooth_smoke_lineup.jpg';
import OverpassHeavenFromWaterSmoke from './overpass_heaven_smoke.gif';
import InfernoBFromASmoke from './inferno_b_from_a_smoke.gif';
import AncientMidSmokeSetup from './ancient_mid_smoke_setup.jpg';
import AncientRedSmokeLineup from './ancient_red_smoke_lineup.jpg';
import AncientCatSmokeLineup from './ancient_cat_smoke_lineup.jpg';

const images = [
    {
        src: AncientRedSmokeLineup,
        map: "Ancient",
        location: "T Spawn",
        utility: "Smoke",
        category: "Lineup",
        label: "Ancient Red Smoke Lineup",
        caption: "Aim at the top left of the tree leaves from the T Spawn setup and jump throw. Lands at the top of mid stairs to red room."
    },
    {
        src: AncientCatSmokeLineup,
        map: "Ancient",
        location: "T Spawn",
        utility: "Smoke",
        category: "Lineup",
        label: "Ancient Cat Smoke Lineup",
        caption: "Aim at this corner where the two walls meet while standing at the T Spawn setup. Jump throw to land a smoke on the catwalk above boxes in mid and before the entrance to cheetah"
    },
    {
        src: AncientMidSmokeSetup,
        map: "Ancient",
        location: "T Spawn",
        utility: "Smoke",
        category: "Setup",
        label: "Ancient Mid Smoke Setup",
        caption: "Stand squarely on the right side of the pillar in T Spawn"
    },
    {
        src: InfernoBFromASmoke,
        map: "Inferno",
        location: "B Site",
        utility: "Smoke",
        category: "Lineup",
        label: "Inferno B Site Smoke",
        caption: "Nestled between the boxes and barrels on A, aim at the angle created by the two roofs and jump throw, smoke lands at the last choke between banana and B"
    },
    {
        src: MirageWindowSmoke,
        map: "Mirage",
        location: "Window",
        utility: "Smoke",
        category: "Lineup",
        label: "Mirage Window Smoke",
        caption: "From the trash can setup hold key D for a moment before jump throwing"
    },
    {
        src: MirageMidSmokeSetup,
        map: "Mirage",
        location: "T Spawn",
        utility: "Smoke",
        category: "Setup",
        label: "Mirage Mid Smoke Setup",
        caption: "Tuck in between trash can and wall"  
    },
    {
        src: MirageConnectorSmoke,
        map: "Mirage",
        location: "Connector",
        utility: "Smoke",
        category: "Lineup",
        label: "Mirage Connector Smoke",
        caption: "Aim at the inside of the bottom right of the rug design. Poor lineup will produce an abusable connector smoke for CT side"
    },
    {
        src: MirageConnectorCTSide,
        map: "Mirage",
        location: "Connector",
        utility: "Smoke", 
        category: "POV",
        label: "Mirage Connector CT POV",
        caption: "CT POV"
    },
    {
        src: MirageCTSmokeSetup,
        map: "Mirage",
        location: "T Spawn",
        utility: "Smoke",
        category: "Setup",
        label: "Mirage CT Smoke Setup",
        caption: "Stare directly at the weird flat face of the wall on the right turn out of T spawn into A ramp approach"
    },
    {
        src: MirageTicketBoothSmoke,
        map: "Mirage",
        location: "CT",
        utility: "Smoke",
        category: "Lineup",
        label: "Mirage Ticket Booth Smoke Lineup",
        caption: "Aim at the pipe-looking protrusion and jump throw"
    },
    {
        src: OverpassHeavenFromWaterSmoke,
        map: "Overpass",
        location: "Heaven",
        utility: "Smoke",
        category: "Lineup",
        label: "Overpass Heaven Smoke",
        caption: "Tuck into the corner, line up with the vertical pipe and aim at the dark line on the wood wall below, move forward and jump throw"
    }
];

export default images;