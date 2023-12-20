package com.nekarak8s.member.common;

public enum ExpTime {
    SECONDS_PER_HOUR(60 * 60),
    MILLISECONDS_PER_HOUR(60 * 60 * 1000);

    private final int value;

    ExpTime(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
