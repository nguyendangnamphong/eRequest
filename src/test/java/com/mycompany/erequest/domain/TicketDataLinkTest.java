package com.mycompany.erequest.domain;

import static com.mycompany.erequest.domain.TicketDataLinkTestSamples.*;
import static com.mycompany.erequest.domain.TicketTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.erequest.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TicketDataLinkTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TicketDataLink.class);
        TicketDataLink ticketDataLink1 = getTicketDataLinkSample1();
        TicketDataLink ticketDataLink2 = new TicketDataLink();
        assertThat(ticketDataLink1).isNotEqualTo(ticketDataLink2);

        ticketDataLink2.setId(ticketDataLink1.getId());
        assertThat(ticketDataLink1).isEqualTo(ticketDataLink2);

        ticketDataLink2 = getTicketDataLinkSample2();
        assertThat(ticketDataLink1).isNotEqualTo(ticketDataLink2);
    }

    @Test
    void ticketTest() {
        TicketDataLink ticketDataLink = getTicketDataLinkRandomSampleGenerator();
        Ticket ticketBack = getTicketRandomSampleGenerator();

        ticketDataLink.setTicket(ticketBack);
        assertThat(ticketDataLink.getTicket()).isEqualTo(ticketBack);

        ticketDataLink.ticket(null);
        assertThat(ticketDataLink.getTicket()).isNull();
    }
}
