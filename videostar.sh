#!/usr/bin/env bash
#
# start/stop script
#
PDOPTS="-font-size 10"
AUDIO_BACKEND=""
VJ_PATCH="main.pd"
GUI_PATCH="main_gui.pd"
USE_JACK=0
PD="$HOME/build/pure-data/bin/pd"


vj_help() {
    echo "start/stop the videostar vj-set ensemble"
    echo "usage: $(basename $0) [start|stop]"
}

vj_start() {
    if [ ! -f $VJ_PATCH ]; then
        echo "$VJ_PATCH not found" 2>&1
        exit 1
    fi
    if [ ! -f $GUI_PATCH ]; then
        echo "$GUI_PATCH not found" 2>&1
        exit 2
    fi
    
    # don't blank screen during performance
    xset -dpms
    xset s noblank
    xset s off

    # are we using jack or not?
    if [ $USE_JACK == 1 ]; then
        # start jackserver
        jackd -d alsa -C &
        AUDIO_BACKEND="-jack"
    else
        AUDIO_BACKEND="-alsa"
    fi

    $PD $PDOPTS $AUDIO_BACKEND $VJ_PATCH &
    echo $! > /tmp/pd_vjset.pid

    $PD $PDOPTS -noaudio -alsamidi $GUI_PATCH &
    echo $! > /tmp/pd_vjgui.pid
}

vj_stop() {

    [ -f /tmp/pd_vjgui.pid ] && \
        kill $(cat /tmp/pd_vjgui.pid) && rm /tmp/pd_vjgui.pid
    [ -f /tmp/pd_vjset.pid ] && \
        kill $(cat /tmp/pd_vjset.pid) && rm /tmp/pd_vjset.pid

    killall pd

    if [ $USE_JACK == 1 ]; then
        killall jackd
    fi
}


# look for patch version override
while getopts ":hp:" OPTS; do
    case $OPTS in
        p)
            PATCH_VERSION=$OPTARG
            ;;
        h)
            vj_help
            exit
            ;;
    esac
done


ARG1=${@:$OPTIND:1}

if [ "$ARG1" == "start" ]; then
    vj_start

elif [ "$ARG1" == "stop" ]; then
    vj_stop

else
    vj_help
    exit
fi
