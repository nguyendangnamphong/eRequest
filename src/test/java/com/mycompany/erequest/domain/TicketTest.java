package com.mycompany.erequest.domain;

import static com.mycompany.erequest.domain.TicketAttachmentTestSamples.*;
import static com.mycompany.erequest.domain.TicketCommentTestSamples.*;
import static com.mycompany.erequest.domain.TicketDataLinkTestSamples.*;
import static com.mycompany.erequest.domain.TicketRelationTestSamples.*;
import static com.mycompany.erequest.domain.TicketSLATestSamples.*;
import static com.mycompany.erequest.domain.TicketStepTestSamples.*;
import static com.mycompany.erequest.domain.TicketTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.erequest.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class TicketTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Ticket.class);
        Ticket ticket1 = getTicketSample1();
        Ticket ticket2 = new Ticket();
        assertThat(ticket1).isNotEqualTo(ticket2);

        ticket2.setId(ticket1.getId());
        assertThat(ticket1).isEqualTo(ticket2);

        ticket2 = getTicketSample2();
        assertThat(ticket1).isNotEqualTo(ticket2);
    }

    @Test
    void stepsTest() {
        Ticket ticket = getTicketRandomSampleGenerator();
        TicketStep ticketStepBack = getTicketStepRandomSampleGenerator();

        ticket.addSteps(ticketStepBack);
        assertThat(ticket.getSteps()).containsOnly(ticketStepBack);
        assertThat(ticketStepBack.getTicket()).isEqualTo(ticket);

        ticket.removeSteps(ticketStepBack);
        assertThat(ticket.getSteps()).doesNotContain(ticketStepBack);
        assertThat(ticketStepBack.getTicket()).isNull();

        ticket.steps(new HashSet<>(Set.of(ticketStepBack)));
        assertThat(ticket.getSteps()).containsOnly(ticketStepBack);
        assertThat(ticketStepBack.getTicket()).isEqualTo(ticket);

        ticket.setSteps(new HashSet<>());
        assertThat(ticket.getSteps()).doesNotContain(ticketStepBack);
        assertThat(ticketStepBack.getTicket()).isNull();
    }

    @Test
    void dataLinksTest() {
        Ticket ticket = getTicketRandomSampleGenerator();
        TicketDataLink ticketDataLinkBack = getTicketDataLinkRandomSampleGenerator();

        ticket.addDataLinks(ticketDataLinkBack);
        assertThat(ticket.getDataLinks()).containsOnly(ticketDataLinkBack);
        assertThat(ticketDataLinkBack.getTicket()).isEqualTo(ticket);

        ticket.removeDataLinks(ticketDataLinkBack);
        assertThat(ticket.getDataLinks()).doesNotContain(ticketDataLinkBack);
        assertThat(ticketDataLinkBack.getTicket()).isNull();

        ticket.dataLinks(new HashSet<>(Set.of(ticketDataLinkBack)));
        assertThat(ticket.getDataLinks()).containsOnly(ticketDataLinkBack);
        assertThat(ticketDataLinkBack.getTicket()).isEqualTo(ticket);

        ticket.setDataLinks(new HashSet<>());
        assertThat(ticket.getDataLinks()).doesNotContain(ticketDataLinkBack);
        assertThat(ticketDataLinkBack.getTicket()).isNull();
    }

    @Test
    void relationsTest() {
        Ticket ticket = getTicketRandomSampleGenerator();
        TicketRelation ticketRelationBack = getTicketRelationRandomSampleGenerator();

        ticket.addRelations(ticketRelationBack);
        assertThat(ticket.getRelations()).containsOnly(ticketRelationBack);
        assertThat(ticketRelationBack.getTicket()).isEqualTo(ticket);

        ticket.removeRelations(ticketRelationBack);
        assertThat(ticket.getRelations()).doesNotContain(ticketRelationBack);
        assertThat(ticketRelationBack.getTicket()).isNull();

        ticket.relations(new HashSet<>(Set.of(ticketRelationBack)));
        assertThat(ticket.getRelations()).containsOnly(ticketRelationBack);
        assertThat(ticketRelationBack.getTicket()).isEqualTo(ticket);

        ticket.setRelations(new HashSet<>());
        assertThat(ticket.getRelations()).doesNotContain(ticketRelationBack);
        assertThat(ticketRelationBack.getTicket()).isNull();
    }

    @Test
    void attachmentsTest() {
        Ticket ticket = getTicketRandomSampleGenerator();
        TicketAttachment ticketAttachmentBack = getTicketAttachmentRandomSampleGenerator();

        ticket.addAttachments(ticketAttachmentBack);
        assertThat(ticket.getAttachments()).containsOnly(ticketAttachmentBack);
        assertThat(ticketAttachmentBack.getTicket()).isEqualTo(ticket);

        ticket.removeAttachments(ticketAttachmentBack);
        assertThat(ticket.getAttachments()).doesNotContain(ticketAttachmentBack);
        assertThat(ticketAttachmentBack.getTicket()).isNull();

        ticket.attachments(new HashSet<>(Set.of(ticketAttachmentBack)));
        assertThat(ticket.getAttachments()).containsOnly(ticketAttachmentBack);
        assertThat(ticketAttachmentBack.getTicket()).isEqualTo(ticket);

        ticket.setAttachments(new HashSet<>());
        assertThat(ticket.getAttachments()).doesNotContain(ticketAttachmentBack);
        assertThat(ticketAttachmentBack.getTicket()).isNull();
    }

    @Test
    void slasTest() {
        Ticket ticket = getTicketRandomSampleGenerator();
        TicketSLA ticketSLABack = getTicketSLARandomSampleGenerator();

        ticket.addSlas(ticketSLABack);
        assertThat(ticket.getSlas()).containsOnly(ticketSLABack);
        assertThat(ticketSLABack.getTicket()).isEqualTo(ticket);

        ticket.removeSlas(ticketSLABack);
        assertThat(ticket.getSlas()).doesNotContain(ticketSLABack);
        assertThat(ticketSLABack.getTicket()).isNull();

        ticket.slas(new HashSet<>(Set.of(ticketSLABack)));
        assertThat(ticket.getSlas()).containsOnly(ticketSLABack);
        assertThat(ticketSLABack.getTicket()).isEqualTo(ticket);

        ticket.setSlas(new HashSet<>());
        assertThat(ticket.getSlas()).doesNotContain(ticketSLABack);
        assertThat(ticketSLABack.getTicket()).isNull();
    }

    @Test
    void commentsTest() {
        Ticket ticket = getTicketRandomSampleGenerator();
        TicketComment ticketCommentBack = getTicketCommentRandomSampleGenerator();

        ticket.addComments(ticketCommentBack);
        assertThat(ticket.getComments()).containsOnly(ticketCommentBack);
        assertThat(ticketCommentBack.getTicket()).isEqualTo(ticket);

        ticket.removeComments(ticketCommentBack);
        assertThat(ticket.getComments()).doesNotContain(ticketCommentBack);
        assertThat(ticketCommentBack.getTicket()).isNull();

        ticket.comments(new HashSet<>(Set.of(ticketCommentBack)));
        assertThat(ticket.getComments()).containsOnly(ticketCommentBack);
        assertThat(ticketCommentBack.getTicket()).isEqualTo(ticket);

        ticket.setComments(new HashSet<>());
        assertThat(ticket.getComments()).doesNotContain(ticketCommentBack);
        assertThat(ticketCommentBack.getTicket()).isNull();
    }
}
