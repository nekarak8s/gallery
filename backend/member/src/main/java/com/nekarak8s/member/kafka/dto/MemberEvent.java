package com.nekarak8s.member.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberEvent {
    private long memberId;
    private String type;

    public static MemberEvent createMemberEvent(long memberId, String type) {
        return MemberEvent.builder()
                .memberId(memberId)
                .type(type)
                .build();
    }
}