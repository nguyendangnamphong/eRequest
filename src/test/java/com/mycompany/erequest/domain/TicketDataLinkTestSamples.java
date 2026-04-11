package com.mycompany.erequest.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class TicketDataLinkTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static TicketDataLink getTicketDataLinkSample1() {
        return new TicketDataLink().id(1L).nodeId(1L).formDataId("formDataId1").parentFormDataId("parentFormDataId1");
    }

    public static TicketDataLink getTicketDataLinkSample2() {
        return new TicketDataLink().id(2L).nodeId(2L).formDataId("formDataId2").parentFormDataId("parentFormDataId2");
    }

    public static TicketDataLink getTicketDataLinkRandomSampleGenerator() {
        return new TicketDataLink()
            .id(longCount.incrementAndGet())
            .nodeId(longCount.incrementAndGet())
            .formDataId(UUID.randomUUID().toString())
            .parentFormDataId(UUID.randomUUID().toString());
    }
}
