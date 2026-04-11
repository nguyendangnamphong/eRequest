package com.mycompany.erequest.domain;

import static com.mycompany.erequest.domain.TicketAttachmentTestSamples.*;
import static com.mycompany.erequest.domain.TicketTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.erequest.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TicketAttachmentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TicketAttachment.class);
        TicketAttachment ticketAttachment1 = getTicketAttachmentSample1();
        TicketAttachment ticketAttachment2 = new TicketAttachment();
        assertThat(ticketAttachment1).isNotEqualTo(ticketAttachment2);

        ticketAttachment2.setId(ticketAttachment1.getId());
        assertThat(ticketAttachment1).isEqualTo(ticketAttachment2);

        ticketAttachment2 = getTicketAttachmentSample2();
        assertThat(ticketAttachment1).isNotEqualTo(ticketAttachment2);
    }

    @Test
    void ticketTest() {
        TicketAttachment ticketAttachment = getTicketAttachmentRandomSampleGenerator();
        Ticket ticketBack = getTicketRandomSampleGenerator();

        ticketAttachment.setTicket(ticketBack);
        assertThat(ticketAttachment.getTicket()).isEqualTo(ticketBack);

        ticketAttachment.ticket(null);
        assertThat(ticketAttachment.getTicket()).isNull();
    }
}
