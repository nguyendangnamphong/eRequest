package com.mycompany.erequest.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class TicketAttachmentTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static TicketAttachment getTicketAttachmentSample1() {
        return new TicketAttachment().id(1L).fileId("fileId1").fileName("fileName1");
    }

    public static TicketAttachment getTicketAttachmentSample2() {
        return new TicketAttachment().id(2L).fileId("fileId2").fileName("fileName2");
    }

    public static TicketAttachment getTicketAttachmentRandomSampleGenerator() {
        return new TicketAttachment()
            .id(longCount.incrementAndGet())
            .fileId(UUID.randomUUID().toString())
            .fileName(UUID.randomUUID().toString());
    }
}
